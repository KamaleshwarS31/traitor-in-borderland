"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Card, CardContent, Typography, Box, Button,
    LinearProgress, Chip, Divider, Alert, CircularProgress
} from "@mui/material";
import { HowToVote, PlayArrow, Stop, Refresh } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";
import socket from "@/lib/socket";

interface PollResult {
    team_id: number;
    team_name: string;
    team_type: string;
    vote_count: number | string;
}

interface Poll {
    id: number;
    round_number: number;
    status: string;
    ends_at: string;
}

export default function PollControl() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [results, setResults] = useState<PollResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [ending, setEnding] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);

    const loadPoll = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getCurrentPollAdmin();
            setPoll(res.data.poll || null);
            setResults(res.data.results || []);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPoll();
    }, [loadPoll]);

    // Timer countdown
    useEffect(() => {
        if (!poll || poll.status !== "active") return;
        const update = () => {
            const rem = Math.max(0, Math.floor((new Date(poll.ends_at).getTime() - Date.now()) / 1000));
            setTimeLeft(rem);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [poll?.ends_at, poll?.status]);

    // Listen for poll events
    useEffect(() => {
        socket.on("poll_started", () => { loadPoll(); setSuccess("Poll started!"); });
        socket.on("poll_ended", () => { loadPoll(); setSuccess("Poll ended — results available."); });
        return () => { socket.off("poll_started"); socket.off("poll_ended"); };
    }, [loadPoll]);

    const handleStart = async () => {
        setStarting(true);
        setError("");
        setSuccess("");
        try {
            await adminAPI.startPoll();
            setSuccess("Poll started! Players are now voting.");
            await loadPoll();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to start poll");
        } finally {
            setStarting(false);
        }
    };

    const handleEnd = async () => {
        if (!poll) return;
        setEnding(true);
        setError("");
        try {
            await adminAPI.endPoll(poll.id);
            setSuccess("Poll ended early.");
            await loadPoll();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to end poll");
        } finally {
            setEnding(false);
        }
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const isActive = poll?.status === "active" && new Date(poll.ends_at) > new Date();
    const topVotes = results.length > 0 ? Math.max(...results.map(r => Number(r.vote_count))) : 0;

    return (
        <Card sx={{
            bgcolor: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(234,179,8,0.2)",
            borderRadius: 3,
            backdropFilter: "blur(10px)",
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <HowToVote sx={{ color: "#EAB308" }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Traitor Poll</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {isActive && (
                            <Chip
                                label={`⏱ ${formatTime(timeLeft)}`}
                                sx={{ bgcolor: "rgba(234,179,8,0.15)", color: "#EAB308", fontWeight: 700, fontFamily: "monospace" }}
                            />
                        )}
                        <Chip
                            label={isActive ? "LIVE" : poll ? "ENDED" : "IDLE"}
                            size="small"
                            sx={{
                                bgcolor: isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                                color: isActive ? "#22C55E" : "rgba(255,255,255,0.4)",
                                fontWeight: 700
                            }}
                        />
                    </Box>
                </Box>

                {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" onClose={() => setSuccess("")} sx={{ mb: 2 }}>{success}</Alert>}

                {/* Active timer bar */}
                {isActive && (
                    <Box sx={{ mb: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={Math.max(0, (timeLeft / 105) * 100)}
                            sx={{
                                height: 8, borderRadius: 4,
                                bgcolor: "rgba(234,179,8,0.1)",
                                "& .MuiLinearProgress-bar": {
                                    bgcolor: timeLeft <= 20 ? "#EF4444" : "#EAB308",
                                    borderRadius: 4
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5, display: "block" }}>
                            Poll closes in {formatTime(timeLeft)} · {results.length} team(s) voted so far
                        </Typography>
                    </Box>
                )}

                {/* Controls */}
                <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={starting ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
                        onClick={handleStart}
                        disabled={starting || isActive}
                        sx={{
                            background: "linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)",
                            color: "#000",
                            fontWeight: 700,
                            "&:disabled": { opacity: 0.4 }
                        }}
                    >
                        Start Poll (1m 45s)
                    </Button>
                    {isActive && (
                        <Button
                            variant="outlined"
                            startIcon={ending ? <CircularProgress size={16} color="inherit" /> : <Stop />}
                            onClick={handleEnd}
                            disabled={ending}
                            sx={{
                                color: "#EF4444",
                                borderColor: "rgba(239,68,68,0.4)",
                                "&:hover": { borderColor: "#EF4444", bgcolor: "rgba(239,68,68,0.05)" }
                            }}
                        >
                            End Early
                        </Button>
                    )}
                    <Button
                        variant="text"
                        startIcon={<Refresh />}
                        onClick={loadPoll}
                        disabled={loading}
                        sx={{ color: "rgba(255,255,255,0.4)", ml: "auto" }}
                    >
                        Refresh
                    </Button>
                </Box>

                {/* Results */}
                {results.length > 0 && (
                    <>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />
                        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.4)", letterSpacing: 3 }}>
                            {isActive ? "Live Vote Tally (Admin Only)" : "Final Results"}
                        </Typography>
                        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            {results.map((r, i) => (
                                <Box key={r.team_id} sx={{
                                    display: "flex", alignItems: "center", gap: 2, p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: r.team_type === "traitor" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
                                    border: r.team_type === "traitor" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.06)"
                                }}>
                                    <Typography sx={{ color: "rgba(255,255,255,0.3)", minWidth: 20, fontWeight: 700 }}>#{i + 1}</Typography>
                                    <Typography sx={{ flex: 1, fontWeight: 600 }}>{r.team_name}</Typography>
                                    {r.team_type === "traitor" && (
                                        <Chip label="TRAITOR" size="small" sx={{ bgcolor: "#EF4444", color: "white", fontSize: "0.6rem", fontWeight: 700 }} />
                                    )}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={topVotes > 0 ? (Number(r.vote_count) / topVotes) * 100 : 0}
                                            sx={{
                                                width: 80, height: 6, borderRadius: 3,
                                                bgcolor: "rgba(255,255,255,0.08)",
                                                "& .MuiLinearProgress-bar": { bgcolor: r.team_type === "traitor" ? "#EF4444" : "#3B82F6" }
                                            }}
                                        />
                                        <Typography sx={{ fontWeight: 700, color: r.team_type === "traitor" ? "#EF4444" : "#94A3B8", minWidth: 24 }}>
                                            {r.vote_count}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                {poll && results.length === 0 && !loading && (
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)", textAlign: "center", py: 1.5 }}>
                        {isActive ? "Waiting for votes..." : "No votes were cast in this poll."}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
