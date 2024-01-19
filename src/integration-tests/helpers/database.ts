import db from "../../database";
import User from "../../models/User.model";
import fakeUsers from "../data/fakeUsers";

async function setupDatabase() {
    await db.query(`
                CREATE TABLE users (
                    user_id INT(11) PRIMARY KEY,
                    first_name VARCHAR(200) NOT NULL,
                    last_name VARCHAR(200) NOT NULL,
                    password VARCHAR(200) UNIQUE NOT NULL,
                    signed_in BOOL NOT NULL,
                    last_signed_in BIGINT(20) NOT NULL,
                    total_time BIGINT(20) NOT NULL
                )
            `);
}

async function cleanUpDatabase() {
    await db.query("DROP TABLE IF EXISTS users, sessions, configs");
}

async function resetTables() {
    let usersParamList: any[][] = [];
    fakeUsers.forEach((user: User) => {
        usersParamList.push([
            user.user_id,
            user.first_name,
            user.last_name,
            user.password,
            user.signed_in,
            user.last_signed_in,
            user.total_time,
        ]);
    });

    await db.query("TRUNCATE TABLE users");

    const sql = `INSERT INTO users
                (user_id, first_name, last_name, password, signed_in, last_signed_in, total_time)
                VALUES ?`;
    await db.query(sql, [usersParamList]);
}

export { setupDatabase, cleanUpDatabase, resetTables };
