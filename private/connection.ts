import { Connection, createConnection } from "mysql2/promise";

const config = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "freshweb",
    port: 3306
}

export async function connect(): Promise<Connection> {
    try {
        const conn = await createConnection(config);
        console.log("Connected to the db");
        return conn;
    } catch (err) {
        console.error("Error connecting to the db", err);
        throw err;
    }
}