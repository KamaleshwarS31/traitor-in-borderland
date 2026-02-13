require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
    try {
        console.log("Connecting to database...");

        // Read schema file
        const schemaPath = path.join(__dirname, "db", "schema.sql");
        const schema = fs.readFileSync(schemaPath, "utf8");

        console.log("Executing schema...");
        await pool.query(schema);

        console.log("✓ Database schema created successfully!");

        // Create master admin user
        const masterEmail = "admin@vit.ac.in"; // Change this to your email

        const existingAdmin = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [masterEmail]
        );

        if (existingAdmin.rows.length === 0) {
            await pool.query(
                "INSERT INTO users (email, role) VALUES ($1, 'master_admin')",
                [masterEmail]
            );
            console.log(`✓ Master admin created: ${masterEmail}`);
        } else {
            console.log(`✓ Master admin already exists: ${masterEmail}`);
        }

        console.log("\n✓ Database initialization complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}

initializeDatabase();
