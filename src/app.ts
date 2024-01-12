import dotenv from "dotenv";
dotenv.config();

import express from "express";
require("express-async-errors"); // Adds error handling for async functions, unnecessary Express v5+

import logger from "./utils/logger";
import api from "./api";
import middleware from "./utils/middleware";

const app = express();

app.use(middleware.json);
app.use(middleware.errorHandler);
app.use("/api/v1", api);

app.listen(process.env.PORT, () => {
    logger.info(`Listening on port ${process.env.PORT}!`);
});
