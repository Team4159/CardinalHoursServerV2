import express, { ErrorRequestHandler } from "express";
import { CustomError } from "./errors";
import logger from "./logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof CustomError && !!err.statusCode) {
        logger.warn(err.message);
        return res.status(err.statusCode).json({
            description: err.message,
        });
    } else {
        logger.error(err);
        return res.sendStatus(500);
    }
} // TODO: Error handling

export default { // TODO: CORS
    json: express.json(),
    errorHandler: errorHandler,
}
