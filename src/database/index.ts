import mysql from "mysql2";
import { Pool } from "mysql2/promise";
import { randomBytes } from "crypto";

let db: Pool;
let tableSuffix = ""; // Only for testing so there is no overlap when multiple tests are being done concurrently

if (process.env.NODE_ENV === "testing") {
    tableSuffix
    db = mysql.createPool({
        host: process.env.TEST_DB_HOST,
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
    }).promise();
    tableSuffix = randomBytes(8).toString("hex");
} else {
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }).promise();
}

console.log(tableSuffix)

export default db;
export {
    tableSuffix,
}