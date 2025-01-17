import { parse, isAfter, isEqual } from "date-fns"

import { ERROR_MESSAGE, TIMEZONE } from "../config/constants"
import { findRestaurantByPhone } from "../utils/firebaseFunctions"
import { generateDialogflowResponse } from "../utils/utils"
import { DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const getFutureHolidays = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const restaurant = await findRestaurantByPhone(parameters.restaurantNumber)
        if (restaurant) {
            const { data: restaurantData } = restaurant
            const currentDate = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TIMEZONE })
            const { holidays } = restaurantData
            const futureHolidays = holidays.filter((holiday) => {
                const holidayDate = parse(holiday.date, "dd/MM/yyyy", new Date())
                const today = parse(currentDate, "dd/MM/yyyy", new Date())
                return isAfter(holidayDate, today) || isEqual(holidayDate, today)
            })
            const futureholidaysNames = futureHolidays.map((holiday) => holiday.reason)
            if (futureholidaysNames.length === 0) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.NO_HOLIDAY, {})
                    ]
                )
            } else {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.FORMAT_HOLIDAY, {}),
                        `${futureholidaysNames.join(", ")}.`
                    ]
                )
            }
        } else {
            console.error("Restaurant not found in Firestore")
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.RESTAURANT_CLOSED, {})
                ]
            )
        }

    } catch (error) {
        console.error("Error checking restaurant status:", error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
