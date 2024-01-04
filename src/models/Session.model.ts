import { RowDataPacket } from "mysql2";


interface Session extends RowDataPacket {
    session_id: number,
    user_id: number,
    start_time: number,
    end_time: number,
    amended: boolean,
}


export default Session;