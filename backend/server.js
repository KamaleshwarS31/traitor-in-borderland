require("dotenv").config();
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
const io = new Server(server, {
    cors: {
        origin: [frontendUrl, "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_team", (teamId) => {
        socket.join(`team_${teamId}`);
        console.log(`Socket ${socket.id} joined team_${teamId}`);
    });

    socket.on("join_admin", () => {
        socket.join("admin");
        console.log(`Socket ${socket.id} joined admin room`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Make io accessible to routes
app.set("io", io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});