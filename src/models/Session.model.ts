import { ResultSetHeader, RowDataPacket } from "mysql2";

import database from "../database";
import { RowNotFoundError } from "../utils/errors";

interface Session extends RowDataPacket {
    session_id: number;
    user_id: number;
    start_time: bigint;
    end_time: bigint;
    amended: boolean;
}

async function getAllSessions(): Promise<Session[]> {
    const sql = "SELECT * FROM `sessions`";
    const [sessions] = await database.query<Session[]>(sql);

    return sessions;
}

async function getSessionsByPassword(password: number): Promise<Session[]> {
    const sql =
        "SELECT * FROM `sessions` WHERE user_id = (SELECT user_id from users WHERE password = ? )";
    const [sessions] = await database.query<Session[]>(sql, [password]);

    if (sessions.length < 1) {
        throw new RowNotFoundError(`Session not found in table: sessions`);
    }

    return sessions;
}

async function createSession(
    password: number,
    start_time: bigint,
    amended: boolean,
    end_time?: bigint
): Promise<boolean> {
    let sql: string;
    let params: any[];

    if (amended) {
        sql =
            "INSERT INTO `sessions` (user_id, start_time, end_time, amended) SELECT user_id, ?, ?, ? FROM users WHERE password = ?)";
        params = [start_time, end_time, amended, password];
    } else {
        sql =
            "INSERT INTO `sessions` (user_id, start_time, amended) SELECT user_id, ?, ? FROM users WHERE password = ?)";
        params = [start_time, amended, password];
    }
    const [resHeader] = await database.query<ResultSetHeader>(sql, params);

    return resHeader.affectedRows == 1;
}

async function updateSession(
    password: number,
    end_time: bigint
): Promise<boolean> {
    const sql =
        "UPDATE `sessions` SET end_time = ? WHERE user_id = (SELECT user_id from 'users' WHERE password = ?)";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [
        end_time,
        password,
    ]);

    return resHeader.affectedRows == 1;
}

async function deleteSession(session_id: number): Promise<boolean> {
    const sql = "DELETE FROM `sessions` WHERE session_id = ?";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [
        session_id,
    ]);

    return resHeader.affectedRows == 1;
}

async function deleteSessionsByUserPassword(
    password: number
): Promise<boolean> {
    const sql =
        "DELETE FROM `sessions` WHERE user_id = (SELECT user_id from users WHERE password = ?)";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [password]);

    return resHeader.affectedRows > 0;
}

export default Session;
export {
    getAllSessions,
    getSessionsByPassword,
    createSession,
    updateSession,
    deleteSession,
    deleteSessionsByUserPassword,
};
