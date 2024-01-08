import dotenv from "dotenv";
dotenv.config();

import express from "express";

import logger from "./utils/logger";
import api from "./api";



const app = express();

app.use("/api/v1", api);

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}!`);
})