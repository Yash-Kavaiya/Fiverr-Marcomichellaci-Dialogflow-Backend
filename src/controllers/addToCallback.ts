import { Callback, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { capitalizeFirstLetter, generateDialogflowResponse } from "../utils/utils"
import { addCallback } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"

export const addToCallback = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const newCallback: Callback = {
            callbackDate: parameters.callback_date,
            callbackTime: parameters.callback_time,
            name: capitalizeFirstLetter(parameters.callback_name.name),
            phone: parameters.callback_phone,
            reason: parameters.callback_reason,
            status: "pending",
        }
        const newCallbackInfo = await addCallback({ callback: newCallback, restaurantId: parameters.restaurantId })
        console.log(newCallbackInfo.id)
        if (newCallbackInfo.status) {
            return generateDialogflowResponse(
                ["Callback saved."]
            )
        } else {
            return generateDialogflowResponse(
                ["Callback not saved."]
            )
        }
    } catch (error) {
        console.error('Error at addToCallback:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
