"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, LinearProgress } from "@mui/material";
import { Timer, HourglassEmpty } from "@mui/icons-material";
import { gameAPI } from "@/lib/api";
import socket from "@/lib/socket";

export default function GameTimer() {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [totalDuration, setTotalDuration] = useState<number>(600); // default 10m
    const [roundActive, setRoundActive] = useState(false);
    const [roundNumber, setRoundNumber] = useState(1);

    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const res = await gameAPI.getGameState();
                const data = res.data;
                const isActive = data.game_status === 'in_progress';
                setRoundActive(isActive);
                setRoundNumber(data.current_round);

                if (isActive && data.round_end_time) {
                    const end = new Date(data.round_end_time).getTime();
                    const now = new Date().getTime();
                    const remaining = Math.max(0, Math.floor((end - now) / 1000));
                    setTimeLeft(remaining);

                    if (data.round_start_time) {
                        const start = new Date(data.round_start_time).getTime();
                        setTotalDuration(Math.floor((end - start) / 1000));
                    }
                } else {
                    setTimeLeft(0);
                }
            } catch (err) {
                console.error("Error fetching game state", err);
            }
        };

        fetchGameState();

        if (!socket.connected) socket.connect();

        // Listen for round updates
        socket.on("round_started", (data: any) => {
            setRoundActive(true);
            setRoundNumber(data.round);
            if (data.end_time) {
                const end = new Date(data.end_time).getTime();
                const start = new Date(data.start_time).getTime();
                const now = new Date().getTime();

                setTotalDuration(Math.floor((end - start) / 1000));
                const remaining = Math.max(0, Math.floor((end - now) / 1000));
                setTimeLeft(remaining);
            }
        });

        socket.on("game_reset", () => {
            setRoundActive(false);
            setRoundNumber(0);
            setTimeLeft(0);
        });

        // We can also assume round ends when timer hits 0 on backend, but usually only "round_ended" event or just state check
        // If backend emits round_ended, we listen. Assuming manual start-round implies prev ended? 
        // Actually admin starts round. End happens automatically?
        // Admin backend doesn't seem to emit "round_ended" automatically via setTimeout, only updates DB end_time.
        // So timer hitting 0 is the visual end.

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => {
            socket.off("round_started");
            socket.off("game_reset");
            clearInterval(timer);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <Card sx={{
            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
            color: "white",
            borderRadius: 4,
            mb: 3,
            boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4)"
        }}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                    {roundActive ? (
                        <Timer sx={{ fontSize: 40, mr: 1, animation: "pulse 1s infinite" }} />
                    ) : (
                        <HourglassEmpty sx={{ fontSize: 40, mr: 1 }} />
                    )}
                    <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 2, textTransform: "uppercase" }}>
                        {roundActive ? `Round ${roundNumber}` : "Round Pending"}
                    </Typography>
                </Box>

                <Typography variant="h1" sx={{ fontWeight: 900, fontSize: "5rem", lineHeight: 1, mb: 2, textShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                    {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                </Typography>

                {roundActive && timeLeft !== null && totalDuration > 0 && (
                    <Box sx={{ width: "80%", mx: "auto" }}>
                        <LinearProgress
                            variant="determinate"
                            value={(timeLeft / totalDuration) * 100}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "rgba(255,255,255,0.2)",
                                "& .MuiLinearProgress-bar": { bgcolor: "white" }
                            }}
                        />
                    </Box>
                )}

                {!roundActive && (
                    <Typography variant="h6" sx={{ opacity: 0.8 }}>
                        Waiting for Master Admin to start...
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
