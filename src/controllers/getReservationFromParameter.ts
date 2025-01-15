import { DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse, getBookingDate } from "../utils/utils"
import { findBookingByCustomerDate, findBookingByCustomerEmail, findBookingByCustomerName, findBookingByCustomerReservationNumber } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"

export const getReservationFromParameter = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse | null> => {
    console.log(detectIntentResponse)
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        if (parameters.FETCH_PARAMETER === "RESERVATION_NUMBER") {
            const bookings = await findBookingByCustomerReservationNumber({ reservationNumber: parameters.reservation_number, restaurantId: parameters.restaurantId })
            if (bookings) {
                if (bookings.data.length > 1) {
                    return generateDialogflowResponse(
                        [`The booking with the reservation number ${parameters.reservation_number} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data,
                                multipleBookings: true
                            }
                        }
                    )
                } else {
                    return generateDialogflowResponse(
                        [`The booking with the reservation number ${parameters.reservation_number} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data[0],
                                multipleBookings: false
                            }
                        }
                    )
                }
            } else {
                return generateDialogflowResponse(
                    [`The booking with the reservation number ${parameters.reservation_number} not found.`],
                    {
                        session: detectIntentResponse.sessionInfo.session,
                        parameters: {
                            foundBooking: "NO"
                        }
                    },
                    {
                        currentPage: detectIntentResponse.pageInfo.currentPage,
                        displayName: detectIntentResponse.pageInfo.displayName,
                        formInfo: {
                            parameterInfo: [
                                {
                                    displayName: "customer_phone",
                                    required: true,
                                    state: "INVALID"
                                }
                            ]
                        }
                    }
                )
            }
        } else if (parameters.FETCH_PARAMETER === "BOOKING_DATE") {
            const day = parameters.booking_date.day as number
            const month = parameters.booking_date.month as number
            const year = parameters.booking_date.year as number
            const { bookingDate } = getBookingDate({ day: day, month: month - 1, year: year })
            const bookings = await findBookingByCustomerDate({ date: bookingDate, restaurantId: parameters.restaurantId })
            if (bookings) {
                if (bookings.data.length > 1) {
                    return generateDialogflowResponse(
                        [`The booking with the booking date ${bookingDate} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data,
                                multipleBookings: true
                            }
                        }
                    )
                } else {
                    return generateDialogflowResponse(
                        [`The booking with the booking date ${bookingDate} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data[0],
                                multipleBookings: false
                            }
                        }
                    )
                }
            } else {
                return generateDialogflowResponse(
                    [`The booking with the booking date ${bookingDate} not found.`],
                    {
                        session: detectIntentResponse.sessionInfo.session,
                        parameters: {
                            foundBooking: "NO"
                        }
                    }
                )
            }
        } else if (parameters.FETCH_PARAMETER === "BOOKING_EMAIL") {
            const bookings = await findBookingByCustomerEmail({ email: parameters.booking_email, restaurantId: parameters.restaurantId })
            if (bookings) {
                if (bookings.data.length > 1) {
                    return generateDialogflowResponse(
                        [`The booking with the email ${parameters.booking_email} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data,
                                multipleBookings: true
                            }
                        }
                    )
                } else {
                    return generateDialogflowResponse(
                        [`The booking with the email ${parameters.booking_email} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data[0],
                                multipleBookings: false
                            }
                        }
                    )
                }
            } else {
                return generateDialogflowResponse(
                    [`The booking with the email ${parameters.booking_email} not found.`],
                    {
                        session: detectIntentResponse.sessionInfo.session,
                        parameters: {
                            foundBooking: "NO"
                        }
                    }
                )
            }
        } else if (parameters.FETCH_PARAMETER === "BOOKING_NAME") {
            const bookings = await findBookingByCustomerName({ name: parameters.booking_name.name, restaurantId: parameters.restaurantId })
            if (bookings) {
                if (bookings.data.length > 1) {
                    return generateDialogflowResponse(
                        [`The booking with the name ${parameters.booking_name.name} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data,
                                multipleBookings: true
                            }
                        }
                    )
                } else {
                    return generateDialogflowResponse(
                        [`The booking with the name ${parameters.booking_name.name} found.`],
                        {
                            session: detectIntentResponse.sessionInfo.session,
                            parameters: {
                                foundBooking: "YES",
                                booking: bookings.data[0],
                                multipleBookings: false
                            }
                        }
                    )
                }
            } else {
                return generateDialogflowResponse(
                    [`The booking with the name ${parameters.booking_name.name} not found.`],
                    {
                        session: detectIntentResponse.sessionInfo.session,
                        parameters: {
                            foundBooking: "NO"
                        }
                    }
                )
            }
        }
        return null;
    } catch (error) {
        console.error('Error at getReservationFromParameter:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
