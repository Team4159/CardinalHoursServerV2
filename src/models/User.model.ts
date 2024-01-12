import { ResultSetHeader, RowDataPacket } from "mysql2";
import database from "../database";
import { RowNotFoundError } from "../utils/errors";
import updateBuilder from "../utils/updateBuilder";

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    password: number;
    signed_in: boolean;
    last_signed_in: number;
    total_time: number;
}

interface UserRowDataPacket extends User, RowDataPacket {};

async function getAllUsers(): Promise<UserRowDataPacket[]> {
    const sql = "SELECT * FROM `users`";
    const [users] = await database.query<UserRowDataPacket[]>(sql);

    return users;
}

async function getUserByPassword(password: number): Promise<User> {
    const sql = "SELECT * FROM `users` WHERE password = ?";
    const [users] = await database.query<UserRowDataPacket[]>(sql, [password]);

    if (users.length < 1) {
        throw new RowNotFoundError("User not found in table: users!");
    }

    return users[0];
}

async function createUser(
    first_name: string,
    last_name: string,
    password: number
): Promise<User> {
    const sql =
        "INSERT INTO `users` (first_name, last_name, password) VALUES (?, ?, ?); SELECT user_id, first_name, last_name FROM users where password = ?";
    const [users] = await database.query<UserRowDataPacket[]>(sql, [
        first_name,
        last_name,
        password,
        password,
    ]);

    return users[0];
}

async function updateUser(user_id: number, values: Partial<User>): Promise<boolean> {
    const update = updateBuilder("users", values, { user_id });
    const [resHeader] = await database.query<ResultSetHeader>(update.query, update.params);

    return resHeader.affectedRows === 1;
}

async function deleteUser(password: number): Promise<boolean> {
    const sql = "DELETE FROM `users` WHERE password = ?";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [password]);

    return resHeader.affectedRows === 1;
}

export default User;
export {
    getAllUsers,
    getUserByPassword,
    createUser,
    updateUser,
    deleteUser,
};
