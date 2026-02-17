const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const db = require("../db");
const { verifyToken } = require("../middleware/auth");

// Verify token and get user role
router.post("/verify", verifyToken, async (req, res) => {
    try {
        res.json({
            role: req.user.role,
            email: req.user.email,
            id: req.user.id
        });
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({ message: "Error verifying user" });
    }
});

// Register member (after joining team)
router.post("/register-member", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        const email = decoded.email;

        // Check if user already exists
        const existingUser = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.json(existingUser.rows[0]);
        }

        // Create new member
        const result = await db.query(
            "INSERT INTO users (email, role) VALUES ($1, 'member') RETURNING *",
            [email]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Register member error:", error);
        res.status(500).json({ message: "Error registering member" });
    }
});

module.exports = router;