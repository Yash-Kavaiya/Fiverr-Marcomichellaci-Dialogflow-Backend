import { formatInTimeZone } from "date-fns-tz";
import { DialogflowMessage, DialogflowResponse, SessionInfo } from "./objectTypes";
import { TIMEZONE } from "../config/constants";

export const generateDialogflowResponse = (messages?: string[], sessionInfo?: SessionInfo): DialogflowResponse => {
    let dialogflowResponse: DialogflowResponse = {};
    if (messages) {
        const formattedMessages: DialogflowMessage[] = messages.map(text => ({
            text: {
                text: [text],
                redactedText: [text]
            },
            responseType: "RESPONSE_TYPE_UNSPECIFIED",
        }));
        dialogflowResponse.fulfillmentResponse = {
            messages: formattedMessages
        };
    }
    if (sessionInfo) {
        dialogflowResponse.sessionInfo = sessionInfo;
    }
    return dialogflowResponse;
};

export const getCurrentDayOfWeek = (): string => {
    const currentDay = formatInTimeZone(new Date(), TIMEZONE, 'dd/MM/yyyy');
    return currentDay;
};

export const getDayOfWeekFromDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const currentDay = formatInTimeZone(new Date(year, month - 1, day), TIMEZONE, 'dd/MM/yyyy');
    return currentDay;
};

export const isTimeWithinRange = (time: string, startTime: string, endTime: string): boolean => {
    if (!time || !startTime || !endTime) {
        console.error('Invalid time parameters:', { time, startTime, endTime });
        return false;
    }
    try {
        const [hours, minutes] = time.split(':').map(Number);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes) ||
            isNaN(startHours) || isNaN(startMinutes) ||
            isNaN(endHours) || isNaN(endMinutes)) {
            console.error('Invalid time format:', { time, startTime, endTime });
            return false;
        }
        const timeValue = hours * 60 + minutes;
        const startValue = startHours * 60 + startMinutes;
        const endValue = endHours * 60 + endMinutes;
        return timeValue >= startValue && timeValue <= endValue;
    } catch (error) {
        console.error('Error parsing time:', error);
        return false;
    }
};
