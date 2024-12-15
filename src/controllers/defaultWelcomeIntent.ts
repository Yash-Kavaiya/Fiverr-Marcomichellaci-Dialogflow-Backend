import { DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse } from "../utils/utils"
import { findRestaurantByPhone } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"

export const defaultWelcomeIntent = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const session = detectIntentResponse.sessionInfo.session
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const restaurant = await findRestaurantByPhone(parameters.restaurantNumber)
        if (restaurant) {
            const { id: restaurantId, data: restaurantData } = restaurant
            return generateDialogflowResponse(
                [`Welcome to ${restaurantData.name}, how can I help you today?`],
                {
                    session: session,
                    parameters: {
                        restaurantData: restaurantData,
                        restaurantId: restaurantId
                    }
                }
            )
        } else {
            console.error(`Unable find the restaurant by the phone: ${parameters.restaurantNumber}`)
            return generateDialogflowResponse(
                ["The restaurant is Closed at this point for unknown reasons."]
            )
        }
    } catch (error) {
        console.error('Error checking restaurant status:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
