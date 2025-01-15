import { DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse } from "../utils/utils"
import { findBookingByCustomerPhone } from "../utils/firebaseFunctions"
import { BOOKING_FOUND, ERROR_MESSAGE } from "../config/constants"
import { MessageKeys } from "../data/messagesKey"
import { getMessage } from "../utils/dynamicMessages"

export const getBookingFromPhone = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        let status = "pending"
        if (parameters.BOOKING_CONFIRMED) {
            status = "confirmed"
        }
        const bookings = await findBookingByCustomerPhone({ customerPhone: parameters.customer_phone, restaurantId: parameters.restaurantId, status })
        if (bookings) {
            if (bookings.data.length > 1) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_PHONE, { customerPhone: parameters.customer_phone })
                    ],
                    {
                        session: detectIntentResponse.sessionInfo.session,
                        parameters: {
                            foundBooking: BOOKING_FOUND.YES,
                            booking: bookings.data,
                            multipleBookings: true
                        }
                    }
                )
            } else {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_FOUND_W_PHONE, { customerPhone: parameters.customer_phone })
                    ],
                    {
                        session: detectIntentResponse.sessionInfo.session,
                        parameters: {
                            foundBooking: BOOKING_FOUND.YES,
                            booking: bookings.data[0],
                            multipleBookings: false
                        }
                    }
                )
            }
        } else {
            return generateDialogflowResponse(
                [
                    getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_FOUND_W_PHONE, { customerPhone: parameters.customer_phone })
                ],
                {
                    session: detectIntentResponse.sessionInfo.session,
                    parameters: {
                        foundBooking: BOOKING_FOUND.NO
                    }
                }
            )
        }
    } catch (error) {
        console.error("Error at saveToBookings:", error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
