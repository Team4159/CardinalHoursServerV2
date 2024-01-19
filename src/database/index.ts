import mysql from "mysql2";
import { Pool } from "mysql2/promise";

let db: Pool;

if (process.env.NODE_ENV === "testing") {
    db = mysql.createPool({
        host: process.env.TEST_DB_HOST,
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
    }).promise();
} else {
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }).promise();
}


export default db;