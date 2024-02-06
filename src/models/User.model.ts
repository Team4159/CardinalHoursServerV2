import { ResultSetHeader, RowDataPacket } from "mysql2";

import db, { tableSuffix } from "../database";
import { RowNotFoundError } from "../utils/errors";
import updateBuilder from "../utils/update-builder";

const usersTableName = "users" + tableSuffix;

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    password: string;
    signed_in: boolean;
    last_signed_in: number;
    total_time: number;
}

interface UserRowDataPacket extends User, RowDataPacket {}

async function getAllUsers(): Promise<UserRowDataPacket[]> {
    const sql = `SELECT * FROM ${usersTableName}`;
    const [users] = await db.query<UserRowDataPacket[]>(sql);

    return users;
}

async function getUserById(userId: number): Promise<User> {
    const sql = `SELECT * FROM ${usersTableName} WHERE user_id = ?`;
    const [users] = await db.query<UserRowDataPacket[]>(sql, [userId]);

    if (users.length < 1) {
        throw new RowNotFoundError(
            `User of ID: ${userId} not found in table: ${usersTableName}`
        );
    }

    return users[0];
}

async function getUserByPassword(password: string): Promise<User> {
    const sql = `SELECT * FROM ${usersTableName} WHERE password = ?`;
    const [users] = await db.query<UserRowDataPacket[]>(sql, [password]);

    if (users.length < 1) {
        throw new RowNotFoundError(`User not found in table: ${usersTableName}!`);
    }

    return users[0];
}

async function createUser(
    first_name: string,
    last_name: string,
    password: string
): Promise<User> {
    const sql =
        `INSERT INTO ${usersTableName} (first_name, last_name, password) VALUES (?, ?, ?); SELECT user_id, first_name, last_name FROM ${usersTableName} where password = ?`;
    const [users] = await db.query<UserRowDataPacket[]>(sql, [
        first_name,
        last_name,
        password,
        password,
    ]);

    return users[0];
}

async function updateUser(
    user_id: number,
    values: Partial<User>
): Promise<boolean> {
    const update = updateBuilder(usersTableName, values, { user_id });
    const [resHeader] = await db.query<ResultSetHeader>(
        update.query,
        update.params
    );

    return resHeader.affectedRows === 1;
}

async function deleteUserByPassword(password: number): Promise<boolean> {
    const sql = `DELETE FROM ${usersTableName} WHERE password = ?`;
    const [resHeader] = await db.query<ResultSetHeader>(sql, [password]);

    return resHeader.affectedRows === 1;
}

export default User;
export {
    getAllUsers,
    getUserById,
    getUserByPassword,
    createUser,
    updateUser,
    deleteUserByPassword,
};
