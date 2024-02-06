import { ResultSetHeader, RowDataPacket } from "mysql2";

import db, { tableSuffix } from "../database";
import { RowNotFoundError } from "../utils/errors";
import updateBuilder from "../utils/update-builder";

const sessionsTableName = "sessions" + tableSuffix;
const usersTableName = "users" + tableSuffix;

interface Session {
    session_id: number;
    user_id: number;
    start_time: number;
    end_time: number;
    amended: boolean;
}

interface SessionRowDataPacket extends Session, RowDataPacket {}

async function getAllSessions(): Promise<Session[]> {
    const sql = `SELECT * FROM ${sessionsTableName}`;
    const [sessions] = await db.query<SessionRowDataPacket[]>(sql);

    return sessions;
}

async function getSessionsByUserId(user_id: number): Promise<Session[]> {
    const sql = `SELECT * FROM ${sessionsTableName} WHERE user_id = ?`;
    const [sessions] = await db.query<SessionRowDataPacket[]>(sql, [user_id]);

    if (sessions.length < 1) {
        throw new RowNotFoundError(`Session not found in table: ${sessionsTableName}!`);
    }

    return sessions;
}

async function getSessionBySessionId(session_id: number): Promise<Session> {
    const sql = `SELECT * FROM ${sessionsTableName} WHERE session_id = ?`;
    const [sessions] = await db.query<SessionRowDataPacket[]>(sql, [session_id]);

    if (sessions.length < 1) {
        throw new RowNotFoundError(`Session not found in table: ${sessionsTableName}!`);
    }

    return sessions[0];
}

async function doesSessionExist(session_id: number): Promise<boolean> {
    const sql = `SELECT * FROM ${sessionsTableName} WHERE session_id = ?`;
    const [sessions] = await db.query<SessionRowDataPacket[]>(sql, [session_id]);

    return sessions.length > 0;
}

async function createSession(user_id: number, start_time: number, end_time: number, amended: boolean): Promise<boolean> {
    const sql = `INSERT INTO ${sessionsTableName} (user_id, start_time, end_time, amended) SELECT user_id, ?, ?, ? FROM ${usersTableName} WHERE user_id = ?`;
    const params = [start_time, end_time, amended, user_id];

    const [resHeader] = await db.query<ResultSetHeader>(sql, params);

    return resHeader.affectedRows === 1;
}

async function updateSession(session_id: number, values: Partial<Session>): Promise<boolean> {
    const update = updateBuilder(sessionsTableName, values, { session_id });
    const [resHeader] = await db.query<ResultSetHeader>(update.query, update.params);

    return resHeader.affectedRows === 1;
}

async function deleteSessionBySessionId(session_id: number): Promise<boolean> {
    const sql = `DELETE FROM ${sessionsTableName} WHERE session_id = ?`;
    const [resHeader] = await db.query<ResultSetHeader>(sql, [session_id]);

    return resHeader.affectedRows === 1;
}

async function deleteSessionsByUserPassword(password: number): Promise<boolean> {
    const sql = `DELETE FROM ${sessionsTableName} WHERE user_id = (SELECT user_id from ${usersTableName} WHERE password = ?)`;
    const [resHeader] = await db.query<ResultSetHeader>(sql, [password]);

    return resHeader.affectedRows > 0;
}

export default Session;
export { getAllSessions, getSessionsByUserId, getSessionBySessionId, doesSessionExist, createSession, updateSession, deleteSessionBySessionId, deleteSessionsByUserPassword };
