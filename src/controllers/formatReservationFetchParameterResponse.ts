import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse } from "../utils/utils"
import { ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const formatReservationFetchParameterResponse = (detectIntentResponse: DetectIntentResponse): DialogflowResponse => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        console.log(`Parameters: ${JSON.stringify(parameters, null, 2)}`)
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        if (parameters.reservation_fetch_parameter == "Email") {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.FORMAT_RESERVATION_FETCH_EMAIL, {})
                ]
            )
        } else if (parameters.reservation_fetch_parameter == "Name") {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.FORMAT_RESERVATION_FETCH_NAME, {})
                ]
            )
        } else if (parameters.reservation_fetch_parameter == "Reservation Number") {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.FORMAT_RESERVATION_FETCH_RESERVATION_NUMBER, {})
                ]
            )
        } else if (parameters.reservation_fetch_parameter == "Date") {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.FORMAT_RESERVATION_FETCH_DATE, {})
                ]
            )
        } else {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
    } catch (error) {
        console.error('Error at getReservationFromParameter:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
