import db from "../../database";
import Session from "../../models/Session.model";
import User from "../../models/User.model";
import fakeSessions from "../data/fakeSessions";
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

    await db.query(`
                CREATE TABLE sessions (
                    session_id INT(11) PRIMARY KEY,
                    user_id INT(11),
                    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                    start_time BIGINT(20) NOT NULL,
                    end_time BIGINT(20) NOT NULL,
                    amended BOOL NOT NULL
                )
            `);
}

async function cleanUpDatabase() {
    await db.query("ALTER TABLE IF EXISTS sessions DROP FOREIGN KEY IF EXISTS fk_session_user"); // Drop foreign key constraint to allow truncating `users`
    await db.query("DROP TABLE IF EXISTS users, sessions, configs");
}

async function resetTables() {
    await resetUsersTable();
    

    let sessionsParamList: any[][] = [];
    fakeSessions.forEach((session: Session) => {
        sessionsParamList.push([
            session.session_id,
            session.user_id,
            session.start_time,
            session.end_time,
            session.amended,
        ]);
    });

    await db.query("TRUNCATE TABLE sessions");

    const sql = `INSERT INTO sessions
                (session_id, user_id, start_time, end_time, amended)
                VALUES ?`;
    await db.query(sql, [sessionsParamList]);
}

async function resetUsersTable() {
    await db.query("ALTER TABLE IF EXISTS sessions DROP FOREIGN KEY IF EXISTS fk_session_user"); // Drop foreign key constraint to allow truncating `users`

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


    await db.query("ALTER TABLE IF EXISTS sessions ADD CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE"); // Add back foreign key constraint
}

export { setupDatabase, cleanUpDatabase, resetTables };
