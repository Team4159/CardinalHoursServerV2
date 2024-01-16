import winston from "winston";

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        ),
    transports: [
        new winston.transports.File({ filename: newLogFileName("error"), level: "error" }),
        new winston.transports.File({ filename: newLogFileName("debug") }),
    ],
});

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "testing") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

function newLogFileName(type: string): string {
    const pathSegments = [];
    pathSegments.push("logs");
    if (process.env.NODE_ENV === "testing") { pathSegments.push("tests") }
    pathSegments.push(type);
    pathSegments.push(type + "_" + dateToTimestamp());

    return pathSegments.join("/") + ".log";
}

function dateToTimestamp(date?: Date): string {
    if (!date) {
        date = new Date();
    }

    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-" + date.getTime();
}

export default logger;