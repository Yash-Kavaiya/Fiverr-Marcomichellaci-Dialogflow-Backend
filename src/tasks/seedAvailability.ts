import { format } from 'date-fns'

import { addAvailability } from '../utils/firebaseFunctions'
import { Availability, Slot } from '../utils/types'

function generateAvailability(date: Date): Availability {
    // Lunch time slots
    const lunchTimeSlots: Slot[] = [
        {
            bookingStartTime: "11:00",
            bookingEndTime: "12:00",
            startTime: "12:00",
            endTime: "14:00",
            availableSeats: 50,
            duration: "2 H"
        },
        {
            bookingStartTime: "13:00",
            bookingEndTime: "14:00",
            startTime: "14:00",
            endTime: "16:00",
            availableSeats: 50,
            duration: "2 H"
        }
    ];

    // Dinner time slots
    const dinnerTimeSlots: Slot[] = [
        {
            bookingStartTime: "18:00",
            bookingEndTime: "19:00",
            startTime: "19:00",
            endTime: "21:00",
            availableSeats: 50,
            duration: "2 H"
        },
        {
            bookingStartTime: "20:00",
            bookingEndTime: "21:00",
            startTime: "21:00",
            endTime: "23:00",
            availableSeats: 50,
            duration: "2 H"
        }
    ];

    return {
        date: format(date, 'dd/MM/yyyy'),
        accpetAllDayReservation: {
            status: true,
            bookingStartTime: "12:00",
            bookingEndTime: "21:00",
            totalSeats: 50,
            duration: "2 H",
            availableSeats: 50
        },
        lunch: {
            totalSeats: 50,
            availableSeats: 50,
            timeSlots: lunchTimeSlots
        },
        dinner: {
            totalSeats: 50,
            availableSeats: 50,
            timeSlots: dinnerTimeSlots
        }
    };
}

function generateAvailabilitiesForPeriod(startDate: Date, endDate: Date): Availability[] {
    const availabilities: Availability[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        // Skip Sundays (0) or any other days you want to block
        if (currentDate.getDay() !== 0) {
            availabilities.push(generateAvailability(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return availabilities;
}

// Generate availabilities for December 2024
const dec2024Start = new Date(2024, 11, 1);
const dec2024End = new Date(2024, 11, 31);
const dec2024Availabilities = generateAvailabilitiesForPeriod(dec2024Start, dec2024End);

// Generate availabilities for all of 2025
const jan2025Start = new Date(2025, 0, 1);
const dec2025End = new Date(2025, 11, 31);
const fullYear2025Availabilities = generateAvailabilitiesForPeriod(jan2025Start, dec2025End);

// Combine the two sets of availabilities
const allAvailabilities = [...dec2024Availabilities, ...fullYear2025Availabilities];

async function main() {
    for (let index = 0; index < allAvailabilities.length; index++) {
        const element = allAvailabilities[index]
        const data = await addAvailability({ availability: element, restaurantId: "8AT04dG4HvbB94wT4SOX" })
        if (data.status) {
            console.log(`Added data, id: ${data.id}`)
        } else {
            console.error("Error adding data.")
        }
    }
}

main()
