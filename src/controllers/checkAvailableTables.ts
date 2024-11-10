import { Request } from "express";
import { DetectIntentResponse, DialogflowResponse, WeeklyOperatingHours, Slot, Availability } from "../utils/objectTypes";
import { ERROR_MESSAGE, TIMEZONE, DIALOGFLOW_FLAGS } from "../config/constants";
import { findAvailabilityByRestaurantPhoneAndDate, findBookingsByRestaurantPhoneAndDate, findRestaurantByPhone } from "../utils/firebaseFunctions";
import { generateDialogflowResponse, getCurrentDayOfWeek, isTimeWithinRange } from "../utils/utils";

export const checkAvailableTables = async (request: Request): Promise<DialogflowResponse> => {
    // Change this to get from the request
    const phone = "+390811234567";
    try {
        const detectIntentResponse = request.body as DetectIntentResponse;
        const session = detectIntentResponse.sessionInfo.session;
        const parameters = detectIntentResponse.sessionInfo.parameters;

        const partySize = parameters.number_of_people;
        const day = parameters.date.day;
        const month = parameters.date.month;
        const year = parameters.date.year;
        const hours = parameters.time.hours;
        const minutes = parameters.time.minutes;
        const currentDay = getCurrentDayOfWeek();
        const bookingDate = new Date(`${day}/${month + 1}/${year}`).toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TIMEZONE });
        const bookingTime = new Date(Date.UTC(year, month + 1, day, hours, minutes, 0)).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TIMEZONE });
        const restaurant = await findRestaurantByPhone(phone);
        if (restaurant) {
            const { id: restaurantId, data: restaurantData } = restaurant;

            // 1. Check for holiday
            const isHoliday = restaurantData.holidays.some(holiday => holiday.date === bookingDate);
            if (isHoliday) {
                return generateDialogflowResponse(
                    [
                        "There is no slot available for reservation today beacuase of a holiday.",
                        "Do you want to choose anothe date and time?"
                    ],
                    {
                        session: session,
                        parameters: {
                            bokkingStatus: DIALOGFLOW_FLAGS.NO_BOOKING
                        }
                    }
                );
            }

            // 2. Check if there's a special event
            const hasSpecialEvent = restaurantData.specialEvents.some(event =>
                event.date === bookingDate && event.requiresReservation === true
            );
            if (hasSpecialEvent) {
                return generateDialogflowResponse(
                    [
                        "There is no slot available for reservation today beacuase of a special event.",
                        "Do you want to choose anothe date and time?"
                    ],
                    {
                        session: session,
                        parameters: {
                            bokkingStatus: DIALOGFLOW_FLAGS.NO_BOOKING
                        }
                    }
                );
            }

            // 3. Check if the restaurant is open on this day
            const operatingHours = restaurantData.operatingHours[currentDay as keyof WeeklyOperatingHours];
            if (!operatingHours) {
                return generateDialogflowResponse(
                    [
                        "Restaurant is not open today.",
                        "Do you want to choose anothe date and time?"
                    ],
                    {
                        session: session,
                        parameters: {
                            bokkingStatus: DIALOGFLOW_FLAGS.NO_BOOKING
                        }
                    }
                );
            }

            // 4. Get availability for the date
            const availability = await findAvailabilityByRestaurantPhoneAndDate(phone, bookingDate);
            if (!availability) {
                return generateDialogflowResponse(
                    [
                        "Restaurant is not open today.",
                        "Do you want to choose anothe date and time?"
                    ],
                    {
                        session: session,
                        parameters: {
                            bokkingStatus: DIALOGFLOW_FLAGS.NO_BOOKING
                        }
                    }
                );
            }
            const { id: availabilityId, data: availabilityData } = availability;

            // Get the existing bookings for the booking date
            const existingBookings = await findBookingsByRestaurantPhoneAndDate(phone, bookingDate);
            let alreadyBookedSeats = 0;
            existingBookings?.data.forEach(data => {
                if (data.status === 'confirmed') {
                    alreadyBookedSeats += data.partySize;
                }
            });

            // 5. Check all-day reservation if enabled
            const { bookingStartTime, bookingEndTime, availableSeats } = availabilityData.accpetAllDayReservation;
            if (availabilityData.accpetAllDayReservation.status) {
                if (!isTimeWithinRange(bookingTime, bookingStartTime, bookingEndTime)) {
                    return generateDialogflowResponse(
                        [
                            `Booking is only available between ${bookingStartTime} and ${bookingEndTime}.`,
                            "Do you want to choose anothe date and time?"
                        ],
                        {
                            session: session,
                            parameters: {
                                bokkingStatus: DIALOGFLOW_FLAGS.NO_BOOKING
                            }
                        }
                    );
                }

                if ((availableSeats - alreadyBookedSeats) < partySize) {
                    return generateDialogflowResponse(
                        [
                            `Not enough seats avaialable for the date ${bookingDate} at ${bookingTime}.`,
                            "Do you want to choose anothe date and time?"
                        ],
                        {
                            session: session,
                            parameters: {
                                bokkingStatus: DIALOGFLOW_FLAGS.NO_BOOKING
                            }
                        }
                    );
                }

                return generateDialogflowResponse(
                    undefined,
                    {
                        session: session,
                        parameters: {
                            bokkingStatus: DIALOGFLOW_FLAGS.YES
                        }
                    }
                );
            }

            // 6. Check lunch and dinner slots
            let availableTimeSlots: Slot[] = [];
            const lunchData = availabilityData.lunch
            if (lunchData) {
                // Add a small amount of logic to update the availableSeats depending on the alreadyBookedSeats
                const matchingSlots = lunchData.timeSlots.filter(slot => {
                    return isTimeWithinRange(bookingTime, slot.bookingStartTime, slot.bookingEndTime) &&
                        (slot.availableSeats - alreadyBookedSeats) >= partySize;
                });
                availableTimeSlots = [...availableTimeSlots, ...matchingSlots];
            }
            const dinnerData = availabilityData.lunch
            if (dinnerData) {
                // Add a small amount of logic to update the availableSeats depending on the alreadyBookedSeats
                const matchingSlots = dinnerData.timeSlots.filter(slot => {
                    return isTimeWithinRange(bookingTime, slot.bookingStartTime, slot.bookingEndTime) &&
                        (slot.availableSeats - alreadyBookedSeats) >= partySize;
                });
                availableTimeSlots = [...availableTimeSlots, ...matchingSlots];
            }
            availableTimeSlots.forEach(timeSlot => {
                timeSlot.availableSeats = timeSlot.availableSeats - alreadyBookedSeats
            });

            if (availableTimeSlots.length === 0) {
                const allSlots = availabilityData.lunch.timeSlots.concat(availabilityData.dinner.timeSlots).map(slot => slot);

                return generateDialogflowResponse(
                    [`Not enough seats avaialable for the date ${bookingDate} at ${bookingTime}.`,],
                    {
                        session: session,
                        parameters: {
                            bokkingStatus: DIALOGFLOW_FLAGS.NO,
                            availableTimeSlots: allSlots
                        }
                    }
                );
            }

            return generateDialogflowResponse(
                undefined,
                {
                    session: session,
                    parameters: {
                        bokkingStatus: DIALOGFLOW_FLAGS.YES,
                        availableTimeSlots: availableTimeSlots
                    }
                }
            );

        } else {
            console.error('Restaurant not found in Firestore.');
            return generateDialogflowResponse(
                ['The restaurant is closed at this point for unknown reasons.']
            );
        }
    } catch (error) {
        console.error('Error checking restaurant status:', error);
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        );
    }
};
