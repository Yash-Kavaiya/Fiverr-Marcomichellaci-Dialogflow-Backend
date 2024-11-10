import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async (request: Request, response: Response) => {
    response.status(200).send("API is working okay.");
});

router.post("/", (request: Request, response: Response) => {
    response.status(200).send("API is working okay.");
});

export default router;
