import { ERROR_MESSAGE } from "../config/constants";
import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types";
import { generateDialogflowResponse } from "../utils/utils";
import { updateBookingProperties } from "../utils/firebaseFunctions";
import { getMessage } from "../utils/dynamicMessages";
import { MessageKeys } from "../data/messagesKey";

export const cancellReservation = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        const bookingId = parameters.booking.id || ""
        if (bookingId !== "") {
            const bookingUpdate: Partial<Bookings> = {
                status: "cancelled"
            }
            const flag = await updateBookingProperties({ bookingId: bookingId, restaurantId: parameters.restaurantId, updates: bookingUpdate })
            console.log(bookingId)
            if (flag) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_CANCELLED, {})
                    ]
                )
            } else {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.BOOKING_NOT_CANCELLED, { errorReason: ERROR_MESSAGE })
                    ]
                )
            }
        } else {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
    } catch (error) {
        console.error("Error at saveToBookings:", error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}