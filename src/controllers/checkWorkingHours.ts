import { ERROR_MESSAGE, TIMEZONE } from "../config/constants"
import { findRestaurantByPhone } from "../utils/firebaseFunctions"
import { DialogflowResponse, WeeklyOperatingHours } from "../utils/types"
import { generateDialogflowResponse, isTimeWithinRange } from "../utils/utils"

export const checkWorkingHours = async (): Promise<DialogflowResponse> => {
    try {
        const restaurant = await findRestaurantByPhone("+390811234567")
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
                            [`The restaurant is closed due to ${holiday.reason}.`]
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
                            [`The restaurant is closed due to ${event.description}.`]
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
                    ["The restaurant is open at this point."]
                )
            } else {
                return generateDialogflowResponse(
                    [`The restaurant is close at this point. it is open for lunch between ${lunchOpen} to ${lunchClose} and for dinner between ${dinnerOpen} to ${dinnerClose}.`]
                )
            }
        } else {
            console.error("Restaurant not found in Firestore.")
            return generateDialogflowResponse(
                ["The restaurant is closed at this point for unknown reasons."]
            )
        }
    } catch (error) {
        console.error("Error checking restaurant status:", error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
