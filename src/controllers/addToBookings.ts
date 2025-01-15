import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { calculateStartAndEndTime, capitalizeFirstLetter, generateDialogflowResponse, getBookingDateAndtime, getFiveUniqueRandomNumbers } from "../utils/utils"
import { addBookings } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"
import { getMessage } from "../utils/dynamicMessages"
import { MessageKeys } from "../data/messagesKey"

export const addToBookings = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        let day, month, year, hours, minutes = 0
        if (parameters.BOOKING_TYPE === "ALTERNATE") {
            day = parameters.alternative_booking_date.day as number
            month = parameters.alternative_booking_date.month as number
            year = parameters.alternative_booking_date.year as number
            hours = parameters.alternative_booking_time.hours as number
            minutes = parameters.alternative_booking_time.minutes as number
        }
        if (parameters.BOOKING_TYPE === "CHANGED") {
            day = parameters.new_booking_date.day as number
            month = parameters.new_booking_date.month as number
            year = parameters.new_booking_date.year as number
            hours = parameters.new_booking_time.hours as number
            minutes = parameters.new_booking_time.minutes as number
        } else {
            day = parameters.booking_date.day as number
            month = parameters.booking_date.month as number
            year = parameters.booking_date.year as number
            hours = parameters.booking_time.hours as number
            minutes = parameters.booking_time.minutes as number
        }
        if (day === 0) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const { bookingDate, bookingTime } = getBookingDateAndtime({ day: day, month: month - 1, year: year, hours: hours, minutes: minutes })
        const { startTime, endTime } = calculateStartAndEndTime({ startTime: bookingTime, duration: parameters.duration })
        const reservationNumber = getFiveUniqueRandomNumbers()
        const newBooking: Bookings = {
            reservationNumber: reservationNumber,
            customerEmail: parameters.email,
            customerName: capitalizeFirstLetter(parameters.name.name),
            customerPhone: parameters.phone,
            date: bookingDate,
            duration: parameters.duration,
            partySize: 4,
            endTime: endTime,
            specialRequests: parameters.special_needs || "No special needs.",
            startTime: startTime,
            status: "pending"
        }
        const newBookingInfo = await addBookings({ booking: newBooking, restaurantId: parameters.restaurantId })
        console.log(newBookingInfo.id)
        if (newBookingInfo.status) {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_SAVED, { reservationNumber: reservationNumber })
                ]
            )
        } else {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_SAVED, { errorReason: ERROR_MESSAGE })
                ]
            )
        }
    } catch (error) {
        console.error('Error at saveToBookings:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
