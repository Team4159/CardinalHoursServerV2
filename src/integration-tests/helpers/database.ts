import db, { tableSuffix } from "../../database";
import Session from "../../models/Session.model";
import User from "../../models/User.model";
import fakeSessions from "../data/fakeSessions";
import fakeUsers from "../data/fakeUsers";

const usersTableName = "users" + tableSuffix;
const sessionsTableName = "sessions" + tableSuffix;

async function setupDatabase() {
    await db.query(`
                CREATE TABLE ${usersTableName} (
                    user_id INT(11) PRIMARY KEY AUTO_INCREMENT,
                    first_name VARCHAR(200) NOT NULL,
                    last_name VARCHAR(200) NOT NULL,
                    password VARCHAR(200) UNIQUE NOT NULL,
                    signed_in BOOL NOT NULL,
                    last_signed_in BIGINT(20) NOT NULL,
                    total_time BIGINT(20) NOT NULL
                )
            `);

    await db.query(`
                CREATE TABLE ${sessionsTableName} (
                    session_id INT(11) PRIMARY KEY AUTO_INCREMENT,
                    user_id INT(11),
                    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES ${usersTableName}(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                    start_time BIGINT(20) NOT NULL,
                    end_time BIGINT(20) NOT NULL,
                    amended BOOL NOT NULL
                )
            `);
}

async function cleanUpDatabase() {
    await db.query(`ALTER TABLE IF EXISTS ${sessionsTableName} DROP FOREIGN KEY IF EXISTS fk_session_user`); // Drop foreign key constraint to allow truncating `users`
    await db.query(`DROP TABLE IF EXISTS ${usersTableName}, ${sessionsTableName}, configs`);
}

async function resetTables() {
    await resetUsersTable();
    await resetSessionsTable();
}

async function resetUsersTable() {
    await db.query(`ALTER TABLE IF EXISTS ${sessionsTableName} DROP FOREIGN KEY IF EXISTS fk_session_user`); // Drop foreign key constraint to allow truncating `users`

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

    await db.query(`TRUNCATE TABLE ${usersTableName}`);

    const sql = `INSERT INTO ${usersTableName}
                (user_id, first_name, last_name, password, signed_in, last_signed_in, total_time)
                VALUES ?`;
    await db.query(sql, [usersParamList]);


    await db.query(`ALTER TABLE IF EXISTS ${sessionsTableName} ADD CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES ${usersTableName} (user_id) ON DELETE CASCADE ON UPDATE CASCADE`); // Add back foreign key constraint
}

async function resetSessionsTable() {
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

    await db.query(`TRUNCATE TABLE ${sessionsTableName}`);

    const sql = `INSERT INTO ${sessionsTableName}
                (session_id, user_id, start_time, end_time, amended)
                VALUES ?`;
    await db.query(sql, [sessionsParamList]);
}

export { setupDatabase, cleanUpDatabase, resetTables };
