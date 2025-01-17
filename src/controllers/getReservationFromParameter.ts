import { DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse, getBookingDate } from "../utils/utils"
import { findBookingByCustomerDate, findBookingByCustomerEmail, findBookingByCustomerName, findBookingByCustomerReservationNumber } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_RESERVATION_NUMBER, { reservationNumber: parameters.reservation_number })
                        ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_RESERVATION_NUMBER, { reservationNumber: parameters.reservation_number })
                        ],
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
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_FOUND_W_RESERVATION_NUMBER, { reservationNumber: parameters.reservation_number })
                    ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_DATE, { bookingDate: bookingDate })
                        ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_DATE, { bookingDate: bookingDate })
                        ],
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
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_FOUND_W_DATE, { bookingDate: bookingDate })
                    ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_EMAIL, { bookingEmail: parameters.booking_email })
                        ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_EMAIL, { bookingEmail: parameters.booking_email })
                        ],
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
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_FOUND_W_EMAIL, { bookingEmail: parameters.booking_email })
                    ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_NAME, { bookingName: parameters.booking_name.name })
                        ],
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
                        [
                            getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_NAME, { bookingName: parameters.booking_name.name })
                        ],
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
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_FOUND_W_NAME, { bookingName: parameters.booking_name.name })
                    ],
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
