import { ERROR_MESSAGE, TIMEZONE } from "../config/constants"
import { MessageKeys } from "../data/messagesKey"
import { getMessage } from "../utils/dynamicMessages"
import { findRestaurantByPhone } from "../utils/firebaseFunctions"
import { DetectIntentResponse, DialogflowResponse, WeeklyOperatingHours } from "../utils/types"
import { generateDialogflowResponse, isTimeWithinRange } from "../utils/utils"

export const checkWorkingHours = async (detectIntentResponse: DetectIntentResponse): Promise<DialogflowResponse> => {
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
            const { operatingHours, holidays, specialEvents } = restaurantData
            const currentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()]
            const currentDate = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TIMEZONE })
            const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", timeZone: TIMEZONE })
            const currentDayData = operatingHours[currentDay as keyof WeeklyOperatingHours]

            // Check if today is a holiday
            if (holidays) {
                for (let index = 0; index < holidays.length; index++) {
                    const holiday = holidays[index]
                    if (holiday.date === currentDate) {
                        return generateDialogflowResponse(
                            [
                                getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_HOLIDAY, { holidayReason: holiday.reason })
                            ]
                        )
                    }
                }
            }

            // Check for a special event
            if (specialEvents) {
                for (let index = 0; index < specialEvents.length; index++) {
                    const event = specialEvents[index]
                    if (event.date === currentDate) {
                        return generateDialogflowResponse(
                            [
                                getMessage(detectIntentResponse.languageCode, MessageKeys.NO_RESERVATION_SPECIAL_EVENT, { specialEventName: event.name, specialEventDescription: event.description, websiteUrl: restaurantData.websiteUrl })
                            ]
                        )
                    }
                }
            }

            // Check for the working hours.
            const lunchOpen = currentDayData.lunch.open
            const lunchClose = currentDayData.lunch.close
            const dinnerOpen = currentDayData.dinner.open
            const dinnerClose = currentDayData.dinner.close
            if (isTimeWithinRange(currentTime, lunchOpen, lunchClose) || isTimeWithinRange(currentTime, dinnerOpen, dinnerClose)) {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.RESTAURANT_OPEN, {})
                    ]
                )
            } else {
                return generateDialogflowResponse(
                    [
                        getMessage(detectIntentResponse.languageCode, MessageKeys.RESTAURANT_CLOSED_W_INFO, { lunchOpen: lunchOpen, lunchClose: lunchClose, dinnerOpen: dinnerOpen, dinnerClose: dinnerClose })
                    ]
                )
            }
        } else {
            console.error("Restaurant not found in Firestore.")
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
