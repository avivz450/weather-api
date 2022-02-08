import mysql from "mysql2/promise";
import log from "@ajar/marker";

const {
    DB_HOST = "localhost",
    DB_PORT = "3306",
    DB_NAME = "bank_db",
    DB_USER_NAME = "root",
    DB_USER_PASSWORD = "qwerty",
} = process.env;

export let sql_con: mysql.Connection;

export const conect = async () => {
    if (sql_con) return sql_con;
    sql_con = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER_NAME,
        database: DB_NAME,
        password: DB_USER_PASSWORD,
    });
    await sql_con.connect();
    log.magenta(" ✨  Connected to MYSQL db ✨ ");
};
