/**
 * Migration script to add new columns to existing database.
 * Run this once: node backend/migrate_new_features.js
 */
const db = require("./db");

async function migrate() {
    console.log("Running migration for new features...");

    try {
        // Add sabotage_enabled to game_state
        await db.query(`ALTER TABLE game_state ADD COLUMN IF NOT EXISTS sabotage_enabled BOOLEAN DEFAULT TRUE`);
        console.log("✓ Added sabotage_enabled to game_state");

        // Add scan_limit to game_state
        await db.query(`ALTER TABLE game_state ADD COLUMN IF NOT EXISTS scan_limit INTEGER DEFAULT 4`);
        console.log("✓ Added scan_limit to game_state");

        // Add location fields to teams
        await db.query(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS last_latitude DOUBLE PRECISION`);
        await db.query(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS last_longitude DOUBLE PRECISION`);
        await db.query(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP`);
        console.log("✓ Added location fields to teams");

        // Make clue_location_id nullable (it already is, but ensure it)
        // No SQL needed - it's already nullable by default in PostgreSQL

        console.log("\n✅ Migration complete!");
        console.log("\nNew features available:");
        console.log("  - sabotage_enabled: Admin can toggle sabotage on/off");
        console.log("  - scan_limit: Admin can set max scans per round");
        console.log("  - location fields: Teams can share GPS location for proximity-based features");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
