import mysql from "mysql2/promise";
import log from "@ajar/marker";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_USER_PASSWORD } =
    process.env;

export const sql_con = await mysql.createConnection({
    host: DB_HOST,
    port:Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER_NAME,
    password:DB_USER_PASSWORD,
    rowsAsArray: true,
});
