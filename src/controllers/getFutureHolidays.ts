import { parse, isAfter, isEqual } from 'date-fns';

import { TIMEZONE } from "../config/constants";
import { findRestaurantByPhone } from "../utils/firebaseFunctions";
import { generateDialogflowResponse } from "../utils/utils";
import { DialogflowResponse } from '../utils/objectTypes';

export const getFutureHolidays = async (): Promise<DialogflowResponse> => {
    try {
        const restaurant = await findRestaurantByPhone("+390811234567");
        if (restaurant) {
            const { id: restaurantId, data: restaurantData } = restaurant;
            const currentDate = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TIMEZONE });
            const { holidays } = restaurantData;
            const futureHolidays = holidays.filter((holiday) => {
                const holidayDate = parse(holiday.date, 'dd/MM/yyyy', new Date());
                const today = parse(currentDate, 'dd/MM/yyyy', new Date());
                return isAfter(holidayDate, today) || isEqual(holidayDate, today);
            });
            const futureholidaysNames = futureHolidays.map((holiday) => holiday.reason);
            if (futureholidaysNames.length === 0) {
                return generateDialogflowResponse(
                    ['There are no upcoming holidays.']
                );
            } else {
                return generateDialogflowResponse(
                    [`Here are the upcoming holidays: ${futureholidaysNames.join(", ")}.`]
                );
            }
        } else {
            console.error('Restaurant not found in Firestore');
            return generateDialogflowResponse(
                ["The restaurant is Closed at this point for unknown reasons."]
            );
        }

    } catch (error) {
        console.error('Error checking restaurant status:', error);
        return generateDialogflowResponse(
            ["The restaurant is Closed at this point for unknown reasons."]
        );
    }
};
