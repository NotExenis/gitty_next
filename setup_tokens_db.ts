import { connect } from "./private/connection";

async function setup() {
    console.log("Setting up tokens database...");
    let conn;
    try {
        conn = await connect();

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS tbl_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                product_id VARCHAR(50) NOT NULL,
                token VARCHAR(255) NOT NULL,
                ip VARCHAR(64) DEFAULT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                duration VARCHAR(50) DEFAULT 'infinite',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_token (token)
            )
        `);
        console.log("Table 'tbl_tokens' created or already exists.");

        // Table setup complete. No sample data insertion.

        console.log("Setup complete!");
    } catch (error) {
        console.error("Setup failed:", error);
    } finally {
        if (conn) conn.end();
    }
}

setup();
