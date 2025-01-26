import { format, formatInTimeZone } from "date-fns-tz"
import { Availability, BookingDate, BookingDateAndTime, DialogflowMessage, DialogflowResponse, PageInfo, SessionInfo } from "./types"
import { TIMEZONE } from "../config/constants"

export const generateDialogflowResponse = (messages?: string[], sessionInfo?: SessionInfo, pageInfo?: PageInfo): DialogflowResponse => {
    const dialogflowResponse: DialogflowResponse = {}
    if (messages) {
        const formattedMessages: DialogflowMessage[] = messages.map(text => ({
            text: {
                text: [text],
                redactedText: [text]
            },
            responseType: "RESPONSE_TYPE_UNSPECIFIED",
        }))
        dialogflowResponse.fulfillmentResponse = {
            messages: formattedMessages
        }
    }
    if (sessionInfo) {
        dialogflowResponse.sessionInfo = sessionInfo
    }
    if (pageInfo) {
        dialogflowResponse.pageInfo = pageInfo
    }
    return dialogflowResponse
}

export const getCurrentDayOfWeek = (): string => {
    const currentDay = formatInTimeZone(new Date(), TIMEZONE, "EEEE")
    return currentDay
}

export const getBookingOfWeekFromDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/').map(Number)
    const utcBookingDate = new Date(year, month - 1, day)
    const bookingDay = format(utcBookingDate, "EEEE")
    return bookingDay
}

export const isTimeWithinRange = (time: string, startTime: string, endTime: string): boolean => {
    if (!time || !startTime || !endTime) {
        console.error('Invalid time parameters:', { time, startTime, endTime })
        return false
    }
    try {
        const [hours, minutes] = time.split(':').map(Number)
        const [startHours, startMinutes] = startTime.split(':').map(Number)
        const [endHours, endMinutes] = endTime.split(':').map(Number)
        if (isNaN(hours) || isNaN(minutes) ||
            isNaN(startHours) || isNaN(startMinutes) ||
            isNaN(endHours) || isNaN(endMinutes)) {
            console.error('Invalid time format:', { time, startTime, endTime })
            return false
        }
        const timeValue = hours * 60 + minutes
        const startValue = startHours * 60 + startMinutes
        const endValue = endHours * 60 + endMinutes
        if (timeValue === 0) {
            return true
        }
        return timeValue >= startValue && timeValue <= endValue
    } catch (error) {
        console.error('Error parsing time:', error)
        return false
    }
}

export const getBookingDateAndtime = ({ day, month, year, hours, minutes }: { day: number, month: number, year: number, hours: number, minutes: number }): BookingDateAndTime => {
    const utcBookingDate = new Date(year, month, day, hours, minutes, 0)
    const bookingDate = format(utcBookingDate, "dd/MM/yyyy")
    const bookingDay = format(utcBookingDate, "EEEE")
    const bookingTime = format(utcBookingDate, "HH:mm")
    const currentDay = formatInTimeZone(new Date(), TIMEZONE, "EEEE")
    return {
        bookingDate: bookingDate,
        bookingDay: bookingDay,
        bookingTime: bookingTime,
        currentDay: currentDay
    }
}

export const getBookingDate = ({ day, month, year }: { day: number, month: number, year: number }): BookingDate => {
    const utcBookingDate = new Date(year, month, day, 0, 0, 0)
    const bookingDate = format(utcBookingDate, "dd/MM/yyyy")
    const bookingDay = format(utcBookingDate, "EEEE")
    return {
        bookingDate: bookingDate,
        bookingDay: bookingDay
    }
}

export const getFiveUniqueRandomNumbers = (): number => {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
        const randomNumber = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        numbers.add(randomNumber);
    }
    return Number(Array.from(numbers).join(""));
}

export const capitalizeFirstLetter = (input: string): string => {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export const calculateStartAndEndTime = ({ startTime, duration }: { startTime: string, duration: string }): { startTime: string; endTime: string } => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [durationValue, durationUnit] = duration.split(" ");
    const durationHours = parseInt(durationValue);
    if (durationUnit !== "H" || isNaN(durationHours)) {
        throw new Error("Invalid duration format. Expected format: 'X H'");
    }
    const endHour = (startHour + durationHours) % 24;
    const endMinute = startMinute;
    const formattedStartTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
    const formattedEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
    return {
        startTime: formattedStartTime,
        endTime: formattedEndTime,
    };
}

export const formatTimeSlots = ({ availability }: { availability: Availability }): string => {
    const formattedTimeSlots: string[] = [];
    availability.lunch.timeSlots.forEach((slot) => {
        formattedTimeSlots.push(`${slot.bookingStartTime} to ${slot.bookingEndTime}`)
    })
    availability.dinner.timeSlots.forEach((slot) => {
        formattedTimeSlots.push(`${slot.bookingStartTime} to ${slot.bookingEndTime}`)
    })
    const formattedTimeSlotsString = formattedTimeSlots.join(", ")
    return formattedTimeSlotsString
}
