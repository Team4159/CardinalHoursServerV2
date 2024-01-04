import { RowDataPacket } from "mysql2";


interface User extends RowDataPacket {
    user_id: number,
    first_name: string,
    last_name: string,
    password: string,
    signed_in: boolean,
    last_signed_in: number,
    total_time: number,
}


export default User;