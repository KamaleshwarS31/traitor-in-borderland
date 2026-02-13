"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    LinearProgress
} from "@mui/material";
import { Dangerous, Timer, FlashOn } from "@mui/icons-material";
import { gameAPI } from "@/lib/api";
import socket from "@/lib/socket";

interface TraitorControlsProps {
    teamId: number;
}

interface InnocentTeam {
    id: number;
    team_name: string;
    total_score: number;
    is_sabotaged: boolean;
}

export default function TraitorControls({ teamId }: TraitorControlsProps) {
    const [loading, setLoading] = useState(true);
    const [innocentTeams, setInnocentTeams] = useState<InnocentTeam[]>([]);
    const [cooldown, setCooldown] = useState<{ remaining: number, total: number }>({ remaining: 0, total: 300 });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchData();
        const interval = setInterval(updateCooldown, 1000);
        // Auto-refresh every 5s
        const refreshInterval = setInterval(() => fetchData(true), 5000);

        socket.on("connect", () => {
            fetchData(true);
        });

        socket.on("sabotage_started_global", (data: any) => {
            if (data.traitor_team_id === teamId) {
                fetchData(); // Refresh my cooldown
            }
            // Update innocent list UI
            setInnocentTeams(prev => prev.map(t =>
                t.id === data.target_team_id ? { ...t, is_sabotaged: true } : t
            ));

            // Failsafe: Auto-refresh after duration to ensure UI sync even if socket misses end event
            if (data.duration) {
                setTimeout(() => {
                    fetchData();
                }, data.duration * 1000 + 1000);
            }
        });

        socket.on("sabotage_ended_global", (data: any) => {
            setInnocentTeams(prev => prev.map(t =>
                t.id === data.target_team_id ? { ...t, is_sabotaged: false } : t
            ));
        });

        socket.on("leaderboard_update", (data: any[]) => {
            setInnocentTeams(prev => prev.map(team => {
                const update = data.find((d: any) => d.id === team.id);
                return update ? { ...team, total_score: update.total_score } : team;
            }));
        });

        return () => {
            clearInterval(interval);
            clearInterval(refreshInterval);
            socket.off("connect");
            socket.off("sabotage_started_global");
            socket.off("sabotage_ended_global");
            socket.off("leaderboard_update");
        };
    }, []);

    const fetchData = async (background = false) => {
        if (!background) setLoading(true);
        try {
            const [teamsRes, cooldownRes] = await Promise.all([
                gameAPI.getInnocentTeams(),
                gameAPI.getSabotageCooldown()
            ]);
            setInnocentTeams(teamsRes.data);

            // api returns { can_sabotage: boolean, remaining_time: number (seconds) }
            if (cooldownRes.data.remaining_time > 0) {
                setCooldown({
                    remaining: cooldownRes.data.remaining_time,
                    total: cooldownRes.data.cooldown_duration || 300
                });
            }
        } catch (err) {
            console.error("Error fetching traitor data:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateCooldown = () => {
        setCooldown(prev => {
            if (prev.remaining <= 0) return prev;
            return { ...prev, remaining: prev.remaining - 1 };
        });
    };

    const handleSabotage = async (targetId: number) => {
        setError("");
        setSuccess("");
        try {
            await gameAPI.sabotage({ target_team_id: targetId });
            setSuccess("Sabotage successful! Target team is blocked.");
            fetchData(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.message || "Sabotage failed");
        }
    };

    if (loading && innocentTeams.length === 0) {
        return <CircularProgress size={20} />;
    }

    return (
        <Card sx={{
            mb: 3,
            background: "linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 3
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Dangerous sx={{ color: "#EF4444", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#FECACA" }}>
                        Sabotage Controls
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                {cooldown.remaining > 0 ? (
                    <Box sx={{ mb: 3, bgcolor: "rgba(0,0,0,0.2)", p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1, color: "#FCA5A5" }}>
                            <Timer fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2" fontWeight={700}>
                                Systems Recharging: {cooldown.remaining}s
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={100 - (cooldown.remaining / cooldown.total * 100)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "rgba(255,255,255,0.1)",
                                "& .MuiLinearProgress-bar": { bgcolor: "#EF4444" }
                            }}
                        />
                    </Box>
                ) : (
                    <Alert severity="warning" icon={<FlashOn />} sx={{ mb: 3, bgcolor: "rgba(234, 179, 8, 0.1)", color: "#FCD34D" }}>
                        Sabotage Ready! Select a target.
                    </Alert>
                )}

                <Typography variant="subtitle2" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
                    Available Targets (Innocents)
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    {innocentTeams.map(team => (
                        <Box key={team.id} sx={{
                            bgcolor: "rgba(0,0,0,0.3)",
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(255,255,255,0.05)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Box>
                                <Typography variant="body1" fontWeight={700} color="white">
                                    {team.team_name}
                                </Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.5)">
                                    Score: {team.total_score}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                disabled={cooldown.remaining > 0 || team.is_sabotaged}
                                onClick={() => handleSabotage(team.id)}
                                sx={{
                                    minWidth: 80,
                                    bgcolor: team.is_sabotaged ? "rgba(255,255,255,0.1)" : "#DC2626",
                                    "&:hover": { bgcolor: "#B91C1C" }
                                }}
                            >
                                {team.is_sabotaged ? "Blocked" : "Attack"}
                            </Button>
                        </Box>
                    ))}
                    {innocentTeams.length === 0 && (
                        <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 2 }}>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                                No innocent teams found.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
