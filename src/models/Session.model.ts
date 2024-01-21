import { ResultSetHeader, RowDataPacket } from "mysql2";

import database from "../database";
import { RowNotFoundError } from "../utils/errors";
import updateBuilder from "../utils/update-builder";

interface Session {
    session_id: number;
    user_id: number;
    start_time: number;
    end_time: number;
    amended: boolean;
}

interface SessionRowDataPacket extends Session, RowDataPacket {}

async function getAllSessions(): Promise<Session[]> {
    const sql = "SELECT * FROM `sessions`";
    const [sessions] = await database.query<SessionRowDataPacket[]>(sql);

    return sessions;
}

async function getSessionsByUserId(user_id: number): Promise<Session[]> {
    const sql = "SELECT * FROM `sessions` WHERE user_id = ?";
    const [sessions] = await database.query<SessionRowDataPacket[]>(sql, [user_id]);

    if (sessions.length < 1) {
        throw new RowNotFoundError("Session not found in table: sessions!");
    }

    return sessions;
}

async function getSessionBySessionId(session_id: number): Promise<Session> {
    const sql = "SELECT * FROM `sessions` WHERE session_id = ?";
    const [sessions] = await database.query<SessionRowDataPacket[]>(sql, [session_id]);

    if (sessions.length < 1) {
        throw new RowNotFoundError("Session not found in table: sessions!");
    }

    return sessions[0];
}

async function doesSessionExist(session_id: number): Promise<boolean> {
    const sql = "SELECT * FROM `sessions` WHERE session_id = ?";
    const [sessions] = await database.query<SessionRowDataPacket[]>(sql, [session_id]);

    return sessions.length < 1;
}

async function createSession(user_id: number, start_time: number, end_time: number, amended: boolean): Promise<boolean> {
    const sql = "INSERT INTO `sessions` (user_id, start_time, end_time, amended) SELECT user_id, ?, ?, ? FROM users WHERE user_id = ?)";
    const params = [start_time, end_time, amended, user_id];

    const [resHeader] = await database.query<ResultSetHeader>(sql, params);

    return resHeader.affectedRows === 1;
}

async function updateSession(session_id: number, values: Partial<Session>): Promise<boolean> {
    const update = updateBuilder("sessions", values, { session_id });
    const [resHeader] = await database.query<ResultSetHeader>(update.query, update.params);

    return resHeader.affectedRows === 1;
}

async function deleteSessionBySessionId(session_id: number): Promise<boolean> {
    const sql = "DELETE FROM `sessions` WHERE session_id = ?";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [session_id]);

    return resHeader.affectedRows === 1;
}

async function deleteSessionsByUserPassword(password: number): Promise<boolean> {
    const sql = "DELETE FROM `sessions` WHERE user_id = (SELECT user_id from users WHERE password = ?)";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [password]);

    return resHeader.affectedRows > 0;
}

export default Session;
export { getAllSessions, getSessionsByUserId, getSessionBySessionId, doesSessionExist, createSession, updateSession, deleteSessionBySessionId, deleteSessionsByUserPassword };
