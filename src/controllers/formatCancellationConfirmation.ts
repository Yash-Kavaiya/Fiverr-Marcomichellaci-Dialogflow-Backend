import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse } from "../utils/utils"
import { ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const formatCancellationConfirmation = (detectIntentResponse: DetectIntentResponse): DialogflowResponse => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        console.log(`Parameters: ${JSON.stringify(parameters, null, 2)}`)
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        if (parameters.multipleBookings) {
            const index = parameters.reservation_option - 1
            const booking = parameters.booking[index] as Bookings
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.CANCELLATION_CONFIRMATION, { bookingDate: booking.date, partySize: booking.partySize, startTime: booking.startTime })
                ]
            )
        } else {
            const booking = parameters.booking as Bookings
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.CANCELLATION_CONFIRMATION, { bookingDate: booking.date, partySize: booking.partySize, startTime: booking.startTime })
                ]
            )
        }
    } catch (error) {
        console.error('Error at getReservationFromParameter:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
