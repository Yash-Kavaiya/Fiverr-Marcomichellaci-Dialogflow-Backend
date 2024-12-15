import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { calculateStartAndEndTime, capitalizeFirstLetter, generateDialogflowResponse, getBookingDateAndtime, getFiveUniqueRandomNumbers } from "../utils/utils"
import { updateBookingProperties } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"

export const updateBooking = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const day = parameters.booking_date.day as number
        const month = parameters.booking_date.month as number
        const year = parameters.booking_date.year as number
        const hours = parameters.booking_time.hours as number
        const minutes = parameters.booking_time.minutes as number
        const { bookingDate, bookingTime } = getBookingDateAndtime({ day: day, month: month - 1, year: year, hours: hours, minutes: minutes })
        const { startTime, endTime } = calculateStartAndEndTime({ startTime: bookingTime, duration: parameters.duration })
        const reservationOption = parameters.reservation_option || ""
        let bookingId = ""
        if (reservationOption === "") {
            bookingId = parameters.booking.id
        } else {
            bookingId = parameters.booking[reservationOption - 1].id
        }
        if (bookingId === "") {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const bookingUpdates: Partial<Bookings> = {
            date: bookingDate,
            partySize: parameters.party_size,
            endTime: endTime,
            startTime: startTime,
            status: "pending"
        }
        const updatedBookingInfo = await updateBookingProperties({ updates: bookingUpdates, bookingId: bookingId, restaurantId: parameters.restaurantId })
        console.log(updatedBookingInfo.id)
        if (updatedBookingInfo.status) {
            return generateDialogflowResponse(
                ["Booking updated."]
            )
        } else {
            return generateDialogflowResponse(
                ["Booking not updated."]
            )
        }
    } catch (error) {
        console.error('Error at updateBooking:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}