import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { calculateStartAndEndTime, generateDialogflowResponse, getBookingDateAndtime } from "../utils/utils"
import { updateBookingProperties } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const updateBooking = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse | null> => {
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
        let bookingId = ""
        if (parameters.multipleBookings) {
            const index = parameters.reservation_option - 1
            bookingId = parameters.booking[index].id
        } else {
            bookingId = parameters.booking.id
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
            return null
        } else {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_UPDATED, {})
                ]
            )
        }
    } catch (error) {
        console.error('Error at updateBooking:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
