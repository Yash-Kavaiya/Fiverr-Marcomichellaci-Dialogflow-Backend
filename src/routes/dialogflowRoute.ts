import express, { Request, Response } from "express"
import { generateDialogflowResponse } from "../utils/utils"
import { addToBookings, addToCallback, addToWaitingList, cancellReservation, checkAvailableTables, checkWorkingHours, defaultWelcomeIntent, formatBookings, getBookingFromPhone, getFutureHolidays, getReservationFromParameter, invalidateBookingDate, updateBooking } from "../controllers"
import { ERROR_MESSAGE } from "../config/constants"
import { DetectIntentResponse } from "../utils/types"

const router = express.Router()

router.get("/webhook", async (request: Request, response: Response) => {
    response.status(200).send("Webhook is working okay.")
})

router.post("/webhook", async (request: Request, response: Response) => {
    let responseData = {}
    try {
        const detectIntentResponse = request.body as DetectIntentResponse
        const tag = detectIntentResponse.fulfillmentInfo.tag
        console.log(`Tag: ${tag}`)
        if (tag === "defaultWelcomeIntent") {
            responseData = await defaultWelcomeIntent(detectIntentResponse)
        } else if (tag === "checkWorkingHours") {
            responseData = await checkWorkingHours(detectIntentResponse)
        } else if (tag === "getFutureHolidays") {
            responseData = await getFutureHolidays(detectIntentResponse)
        } else if (tag === "checkAvailableTables") {
            responseData = await checkAvailableTables(detectIntentResponse)
        } else if (tag === 'addToBookings') {
            responseData = await addToBookings(detectIntentResponse)
        } else if (tag === 'addToWaitingList') {
            const tempData = await addToWaitingList(detectIntentResponse)
            if (tempData !== null) {
                responseData = tempData
            } else {
                responseData = generateDialogflowResponse(
                    [ERROR_MESSAGE]
                )
            }
        } else if (tag == 'addToCallback') {
            const tempData = await addToCallback(detectIntentResponse)
            if (tempData !== null) {
                responseData = tempData
            } else {
                responseData = generateDialogflowResponse(
                    [ERROR_MESSAGE]
                )
            }
        } else if (tag === "getBookingFromPhone") {
            responseData = await getBookingFromPhone(detectIntentResponse)
        } else if (tag === "invalidateBookingDate") {
            responseData = invalidateBookingDate(detectIntentResponse)
        } else if (tag === "getReservationFromParameter") {
            const tempData = await getReservationFromParameter(detectIntentResponse)
            if (tempData !== null) {
                responseData = tempData
            } else {
                responseData = generateDialogflowResponse(
                    [ERROR_MESSAGE]
                )
            }
        } else if (tag === "cancellReservation") {
            responseData = cancellReservation(detectIntentResponse)
        } else if (tag === "updateBooking") {
            const tempData = await updateBooking(detectIntentResponse)
            if (tempData !== null) {
                responseData = tempData
            } else {
                responseData = generateDialogflowResponse(
                    [ERROR_MESSAGE]
                )
            }
        } else if (tag === "formatBookings") {
            const tempData = formatBookings(detectIntentResponse)
            if (tempData !== null) {
                responseData = tempData
            } else {
                responseData = generateDialogflowResponse(
                    [ERROR_MESSAGE]
                )
            }
        } else {
            responseData = generateDialogflowResponse(
                [`No handler for the tag ${tag}.`]
            )
        }
    } catch (error) {
        responseData = generateDialogflowResponse(
            [ERROR_MESSAGE]
        )
    }
    response.send(responseData)
})

export default router
