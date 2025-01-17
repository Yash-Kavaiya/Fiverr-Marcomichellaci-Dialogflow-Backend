import { compareAsc } from "date-fns"

import { DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse } from "../utils/utils"
import { ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../utils/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const invalidateBookingDate = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse | null> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const day = parameters.booking_date.day
        const month = parameters.booking_date.month
        const year = parameters.booking_date.year
        const flag = compareAsc(new Date(year, month - 1, day), new Date())
        if (flag === -1) {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.INVALIDATE_BOOKING_DATE, {})
                ],
                undefined,
                {
                    currentPage: detectIntentResponse.pageInfo.currentPage,
                    displayName: detectIntentResponse.pageInfo.displayName,
                    formInfo: {
                        parameterInfo: [
                            {
                                displayName: "booking_date",
                                required: true,
                                state: "INVALID"
                            }
                        ]
                    }
                }
            )
        }
        return null
    } catch (error) {
        console.error('Error at invalidateBookingDate:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}