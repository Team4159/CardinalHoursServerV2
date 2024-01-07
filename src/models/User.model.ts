import { ResultSetHeader, RowDataPacket } from "mysql2";
import database from "../database";


interface User extends RowDataPacket {
    user_id: number,
    first_name: string,
    last_name: string,
    password: number,
    signed_in: boolean,
    last_signed_in: bigint,
    total_time: bigint
}


async function getAllUsers(): Promise<User[]> {
    const sql = "SELECT * FROM `users`";
    const [ users ] = await database.query<User[]>(sql);

    return users;
}

async function getUserByPassword(password: number): Promise<User> {
    const sql = "SELECT * FROM `users` WHERE password = ?"
    const [users] = await database.query<User[]>(sql, [ password ]);

    if (users.length < 1) {
        throw new RowNotFoundError('User not found in table: users');
    }

    return users[0];
}

async function createUser(
    first_name: string,
    last_name: string,
    password: number,
    ): Promise<User> {
    const sql = "INSERT INTO `users` (first_name, last_name, password) VALUES (?, ?, ?); SELECT user_id, first_name, last_name FROM users where password = ?";
    const [ users ]  = await database.query<User[]>(sql, [ first_name, last_name, password, password ]);

    return users[0];
}

async function updateUserTotalTime(password: number): Promise<boolean> {
    const sql = "UPDATE users SET total_time = (SELECT SUM(CASE WHEN end_time - start_time < 43200000 THEN end_time - start_time ELSE 0 END) FROM sessions WHERE user_id = (SELECT user_id FROM users WHERE password = ?)); SELECT user_id, first_name, last_name from users where password = ?";
    const [ resHeader ] =  await database.query<ResultSetHeader>(sql, [ password, password ]);
    
    return resHeader.affectedRows == 1;
}

async function updateUserLastSignedIn(password: number, newValue: bigint): Promise<boolean> {
    const sql = "UPDATE `users` SET last_signed_in = ? WHERE password = ?; SELECT user_id, first_name, last_name, last_signed_in FROM `users` where password = ?";
    const [ resHeader ] =  await database.query<ResultSetHeader>(sql, [ newValue, password, password ]);

    return resHeader.affectedRows == 1;
}


async function deleteUser(password: number): Promise<boolean> {
    const sql = "DELETE FROM `users` WHERE password = ?";
    const [ resHeader ] = await database.query<ResultSetHeader>(sql, [ password ]);

    return resHeader.affectedRows == 1;

}

export default User;
export {
    getAllUsers,
    getUserByPassword,
    createUser,
    updateUserTotalTime,
    updateUserLastSignedIn,
    deleteUser
}








