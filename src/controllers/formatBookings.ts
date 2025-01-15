import { Bookings, DetectIntentResponse, DialogflowResponse } from "../utils/types"
import { generateDialogflowResponse, getBookingDate } from "../utils/utils"
import { findBookingByCustomerDate, findBookingByCustomerEmail, findBookingByCustomerName, findBookingByCustomerReservationNumber } from "../utils/firebaseFunctions"
import { ERROR_MESSAGE } from "../config/constants"

export const formatBookings = (detectIntentResponse: DetectIntentResponse): DialogflowResponse | null => {
    try {
        const parameters = detectIntentResponse.sessionInfo.parameters
        if (parameters == null) {
            return generateDialogflowResponse(
                [ERROR_MESSAGE]
            )
        }
        if (parameters.foundBooking === "YES") {
            const bookings = parameters.booking as Bookings[];
            const bookingsString = bookings.map((booking, index) => {
                return `Option: ${index + 1} Reservation Number: ${booking.reservationNumber}, Name: ${booking.customerName}, Email: ${booking.customerEmail}, Date: ${booking.date}`;
            })
            return generateDialogflowResponse(
                [
                    "Please select your reservation from the following by providing the appropriate option:",
                    bookingsString.join("\n")
                ]
            )
        }
        return null
    } catch (error) {
        console.error('Error at getReservationFromParameter:', error)
        return generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
}
