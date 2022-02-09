import mysql from "mysql2/promise";
import log from "@ajar/marker";
import fs from 'fs';

process.env = JSON.parse(fs.readFileSync('./app-config.json', 'utf8'));

const { SQL_HOST, SQL_PORT, SQL_USER, SQL_PASSWORD, DB_NAME } = process.env;

export const sql_con = await (async () => await mysql.createConnection({
    host: SQL_HOST,
    port: Number(SQL_PORT),
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: DB_NAME
}))();
