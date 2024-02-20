import logger from "../utils/logger";

async function asyncExponentialBackoff(f: Function, maxAttempts = process.env.DEFAULT_EXP_BACKOFF_MAX_ATTEMPTS) {
    let succeeded = false;
    let attempts = 0;
    let backoffTime = 0; // In seconds

    while (!succeeded) {
        try {
            return await f();
        } catch (err) {
            logger.warn("Exponential backoff error caught!");

            // https://developers.google.com/drive/labels/limits#example-algorithm
            backoffTime = Math.min(Math.pow(2, attempts) + Math.random(), 64);

            logger.warn(`Attempt: ${attempts} Backoff Time: ${backoffTime} seconds`);
            await new Promise(resolve => setTimeout(resolve, backoffTime * 1000));
            attempts++;

            if (attempts > maxAttempts) {
                throw err;
            }
        }
    }
}

export default asyncExponentialBackoff;