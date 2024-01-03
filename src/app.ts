require("dotenv").config()

import express from "express";

import logger from "./utils/logger";


const app = express();

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}!`);
})