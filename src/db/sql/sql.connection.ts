import mysql from "mysql2/promise";

// const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_USER_PASSWORD } =
//     process.env; // CHANGE TO JSON CONFIG

// export const sql_con = await mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     database: 'bank_db',
//     user: 'root',
//     password:'qwerty',
//     rowsAsArray: true,
// });

export const sql_con = await (async () => await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'bank_db',
    user: 'root',
    password:'qwerty',
    // rowsAsArray: true,
}))();