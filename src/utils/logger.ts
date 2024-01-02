import winston from "winston";

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        ),
    transports: [
        new winston.transports.File({ filename: `logs/error/error_${newFileName()}.log`, level: "error" }),
        new winston.transports.File({ filename: `logs/debug/debug_${newFileName()}.log` }),
    ]
});

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "testing") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

function newFileName(date?: Date): string {
    if (!date) {
        date = new Date();
    }

    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

export default logger