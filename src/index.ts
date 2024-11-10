import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import homeRoute from "./routes/homeRoute";
import dialogflowRout from "./routes/dialogflowRoute";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((request: Request, response: Response, next: NextFunction) => {
    console.log(`Path: ${request.path} called with the method: ${request.method}`);
    next();
});

app.use("/", homeRoute);
app.use("/dialogflow", dialogflowRout);

app.listen(PORT, () => {
    console.log(`Server running at: http://127.0.0.1:${PORT}`);
}).on("error", (error) => {
    throw new Error(error.message);
});
