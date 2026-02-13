const admin = require("../config/firebase");
const db = require("../db");

// Verify Firebase token and check VIT email
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        const email = decoded.email;

        // Check VIT email domain
        if (!email.endsWith("@vit.ac.in") && !email.endsWith("@vitstudent.ac.in")) {
            return res.status(403).json({ message: "Invalid VIT email domain" });
        }

        // Get user from database
        const userResult = await db.query(
            "SELECT id, email, role FROM users WHERE email = $1",
            [email]
        );

        if (!userResult.rows.length) {
            return res.status(403).json({ message: "User not registered" });
        }

        req.user = userResult.rows[0];
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Invalid token: " + error.message });
    }
};

// Check if user is master admin
const isMasterAdmin = (req, res, next) => {
    if (req.user.role !== "master_admin") {
        return res.status(403).json({ message: "Access denied. Master admin only." });
    }
    next();
};

// Check if user is team lead
const isTeamLead = (req, res, next) => {
    if (req.user.role !== "team_lead") {
        return res.status(403).json({ message: "Access denied. Team lead only." });
    }
    next();
};

module.exports = {
    verifyToken,
    isMasterAdmin,
    isTeamLead
};
