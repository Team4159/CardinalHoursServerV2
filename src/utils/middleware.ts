import express, { ErrorRequestHandler } from "express";
import logger from "./logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
        logger.error(err);
        return res.sendStatus(500);
} // TODO: Error handling

export default { // TODO: CORS
    json: express.json(),
    errorHandler: errorHandler,
}
