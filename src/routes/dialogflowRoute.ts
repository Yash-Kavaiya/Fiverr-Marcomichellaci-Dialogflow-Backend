import express, { Request, Response } from "express";
import { generateDialogflowResponse } from "../utils/utils";
import { DetectIntentResponse } from "../utils/objectTypes";
import { checkAvailableTables, checkWorkingHours, getFutureHolidays } from "../controllers";

const router = express.Router();

router.get("/webhook", async (request: Request, response: Response) => {
    response.status(200).send("Webhook is working okay.");
});

router.post("/webhook", async (request: Request, response: Response) => {
    const detectIntentResponse = request.body as DetectIntentResponse;
    const tag = detectIntentResponse.fulfillmentInfo.tag;
    let responseData = {};
    if (tag === 'checkWorkingHours') {
        responseData = await checkWorkingHours();
    } else if (tag === 'getFutureHolidays') {
        responseData = await getFutureHolidays();
    }
    else if (tag === 'checkAvailableTables') {
        responseData = await checkAvailableTables(request);
    }
    // else if (tag === 'saveToBookings') {
    //     responseData = await saveToBookings(req);
    // } else if (tag === 'addToWaitingList') {
    //     responseData = await addToWaitingList(req);
    // } else if (tag == 'getACallback') {
    //     responseData = await getACallback(req);
    // } 
    else {
        responseData = generateDialogflowResponse(
            [`No handler for the tag ${tag}.`]
        );
    }
    response.send(responseData);
});

export default router;
