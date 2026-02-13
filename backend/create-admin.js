require("dotenv").config();
const admin = require("./config/firebase");
const db = require("./db");

async function createAdminUser() {
    const adminEmail = "admin@vit.ac.in";
    const adminPassword = "Admin@123";

    try {
        console.log("Creating Firebase admin user...");

        // Check if user already exists in Firebase
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().getUserByEmail(adminEmail);
            console.log("✅ Firebase user already exists");
        } catch (error) {
            // User doesn't exist, create it
            firebaseUser = await admin.auth().createUser({
                email: adminEmail,
                password: adminPassword,
                emailVerified: true,
            });
            console.log("✅ Firebase user created successfully");
        }

        // Check if user exists in database
        const dbUser = await db.query("SELECT * FROM users WHERE email = $1", [adminEmail]);

        if (dbUser.rows.length === 0) {
            // Create in database
            await db.query(
                "INSERT INTO users (email, role) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
                [adminEmail, "master_admin"]
            );
            console.log("✅ Database user created successfully");
        } else {
            console.log("✅ Database user already exists");
        }

        console.log("\n" + "=".repeat(60));
        console.log("🎉 ADMIN ACCOUNT READY!");
        console.log("=".repeat(60));
        console.log("\n📧 Email:    " + adminEmail);
        console.log("🔑 Password: " + adminPassword);
        console.log("\n⚠️  IMPORTANT: Change this password after first login!");
        console.log("=".repeat(60) + "\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        process.exit(1);
    }
}

createAdminUser();
