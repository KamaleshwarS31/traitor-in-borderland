"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
    LinearProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { PlayArrow, Refresh, Timer } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";
import socket from "@/lib/socket";

interface GameState {
    current_round: number;
    total_rounds: number;
    round_duration: number;
    round_start_time: string | null;
    round_end_time: string | null;
    game_status: string;
}

export default function RoundControl() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);

    const fetchGameState = async () => {
        try {
            const response = await adminAPI.getGameSettings();
            setGameState(response.data);
        } catch (error) {
            console.error("Error fetching game state:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGameState();

        // Listen for round start events
        socket.on("round_started", () => {
            fetchGameState();
        });

        socket.on("game_reset", () => {
            fetchGameState();
        });

        return () => {
            socket.off("round_started");
            socket.off("game_reset");
        };
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!gameState?.round_end_time) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(gameState.round_end_time!).getTime();
            const remaining = Math.max(0, Math.floor((end - now) / 1000));
            setTimeRemaining(remaining);

            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState?.round_end_time]);

    const handleStartRound = async () => {
        try {
            await adminAPI.startRound();
            await fetchGameState();
        } catch (error: any) {
            console.error("Error starting round:", error);
            alert(error.response?.data?.message || "Failed to start round");
        }
    };

    const handleResetGame = async () => {
        try {
            await adminAPI.resetGame();
            await fetchGameState();
            setResetDialogOpen(false);
        } catch (error) {
            console.error("Error resetting game:", error);
            alert("Failed to reset game");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading || !gameState) {
        return (
            <Card>
                <CardContent>
                    <LinearProgress />
                </CardContent>
            </Card>
        );
    }

    const progress = gameState.round_end_time
        ? ((gameState.round_duration - timeRemaining) / gameState.round_duration) * 100
        : 0;

    return (
        <>
            <Grid container spacing={3}>
                {/* Game Status Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                Game Status
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Current Round
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: "primary.main" }}>
                                    {gameState.current_round} / {gameState.total_rounds}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Status
                                </Typography>
                                <Alert
                                    severity={
                                        gameState.game_status === "in_progress"
                                            ? "success"
                                            : gameState.game_status === "completed"
                                                ? "info"
                                                : "warning"
                                    }
                                    sx={{ fontWeight: 600 }}
                                >
                                    {gameState.game_status.toUpperCase().replace("_", " ")}
                                </Alert>
                            </Box>

                            {gameState.game_status === "in_progress" && (
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Timer sx={{ mr: 1, color: "warning.main" }} />
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: "warning.main" }}>
                                            {formatTime(timeRemaining)}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            background: "rgba(255, 255, 255, 0.1)",
                                            "& .MuiLinearProgress-bar": {
                                                background: "linear-gradient(90deg, #3B82F6 0%, #F59E0B 100%)",
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Controls Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                Game Controls
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<PlayArrow />}
                                    onClick={handleStartRound}
                                    disabled={
                                        gameState.game_status === "in_progress" ||
                                        gameState.current_round >= gameState.total_rounds
                                    }
                                    sx={{
                                        py: 2,
                                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                        },
                                        "&:disabled": {
                                            background: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    {gameState.current_round === 0
                                        ? "Start Round 1"
                                        : `Start Round ${gameState.current_round + 1}`}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    startIcon={<Refresh />}
                                    onClick={() => setResetDialogOpen(true)}
                                    sx={{
                                        py: 2,
                                        borderColor: "error.main",
                                        color: "error.main",
                                        "&:hover": {
                                            borderColor: "error.dark",
                                            background: "rgba(239, 68, 68, 0.1)",
                                        },
                                    }}
                                >
                                    Reset Game
                                </Button>
                            </Box>

                            <Alert severity="info" sx={{ mt: 3 }}>
                                <Typography variant="body2">
                                    <strong>Note:</strong> Starting a round will assign clues to all teams and begin
                                    the timer. Make sure all teams are ready!
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Round Info */}
                <Grid size={{ xs: 12 }}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                                Round Configuration
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Rounds
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {gameState.total_rounds}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Round Duration
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {gameState.round_duration / 60} minutes
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Completed Rounds
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {gameState.current_round}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Remaining Rounds
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {gameState.total_rounds - gameState.current_round}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Reset Confirmation Dialog */}
            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                <DialogTitle>Reset Game?</DialogTitle>
                <DialogContent>
                    <Typography>
                        This will reset all scores, gold bars, clues, and game state. This action cannot be
                        undone. Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetGame} color="error" variant="contained">
                        Reset Game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
