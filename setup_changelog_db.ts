import { connect } from "./private/connection";

async function setup() {
    console.log("Setting up changelog database...");
    let conn;
    try {
        conn = await connect();

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS tbl_changelogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'tbl_changelogs' created or already exists.");

        // Check if empty, if so insert sample data
        const [rows]: any = await conn.execute('SELECT COUNT(*) as count FROM tbl_changelogs');
        if (rows[0].count === 0) {
            console.log("Inserting sample data...");
            await conn.execute(`
                INSERT INTO tbl_changelogs (title, description, date) VALUES 
                ('Velocity v2.0 Release', '<p>We are thrilled to announce the release of <b>Velocity v2.0</b>!</p><br><p>This update includes:</p><ul><li>- Complete code rewrite</li><li>- <u>Significant</u> performance improvements</li><li>- New UI components</li></ul>', '2024-10-24 12:00:00'),
                ('Security Patch v1.5.4', '<p>Addressed a critical vulnerability in the auth system. <b>Update immediately.</b></p>', '2024-09-15 12:00:00')
             `);
            console.log("Sample data inserted.");
        }

        console.log("Setup complete!");
    } catch (error) {
        console.error("Setup failed:", error);
    } finally {
        if (conn) conn.end();
    }
}

setup();
