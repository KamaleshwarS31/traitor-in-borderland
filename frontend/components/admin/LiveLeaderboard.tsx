"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    CircularProgress,
    Switch,
    FormControlLabel,
    Alert,
} from "@mui/material";
import { EmojiEvents, Shield, Dangerous } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";
import socket from "@/lib/socket";

interface Team {
    id: number;
    team_name: string;
    team_type: string;
    total_score: number;
    member_count: string;
}

export default function LiveLeaderboard() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(false);
    const [error, setError] = useState("");

    const fetchLeaderboard = async () => {
        try {
            const response = await adminAPI.getLeaderboard();
            setTeams(response.data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        checkPublishStatus();

        // Listen for real-time updates
        socket.on("leaderboard_update", (updatedTeams: Team[]) => {
            setTeams(updatedTeams);
        });

        socket.on("leaderboard_visibility", (data: { visible: boolean }) => {
            setIsPublished(data.visible);
        });

        return () => {
            socket.off("leaderboard_update");
            socket.off("leaderboard_visibility");
        };
    }, []);

    const checkPublishStatus = async () => {
        try {
            // Assuming game settings or state has this info.
            // We can use adminAPI.getGameSettings() or a specific endpoint.
            // adminAPI.getGameSettings returns all game_state columns.
            const res = await adminAPI.getGameSettings();
            if (res.data) {
                setIsPublished(res.data.is_leaderboard_published || false);
            }
        } catch (e) {
            console.error("Failed to check publish status", e);
        }
    };

    const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        // Optimistic update
        setIsPublished(checked);
        try {
            await adminAPI.toggleLeaderboard(checked);
        } catch (err) {
            console.error("Toggle error:", err);
            setIsPublished(!checked); // Revert
            setError("Failed to update leaderboard visibility");
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EmojiEvents sx={{ fontSize: 32, color: "warning.main", mr: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Live Leaderboard
                        </Typography>
                        <Chip
                            label="LIVE"
                            color="success"
                            size="small"
                            sx={{ ml: 2, animation: "pulse 2s infinite" }}
                        />
                    </Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPublished}
                                onChange={handleToggle}
                                color="primary"
                            />
                        }
                        label={isPublished ? "Published" : "Hidden"}
                        sx={{
                            color: isPublished ? "success.main" : "text.secondary",
                            bgcolor: "rgba(255,255,255,0.05)",
                            pr: 2,
                            borderRadius: 2
                        }}
                    />
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Members</TableCell>
                                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No teams yet. Create team leads to get started.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                teams.map((team, index) => (
                                    <TableRow
                                        key={team.id}
                                        sx={{
                                            "&:hover": {
                                                background: "rgba(255, 255, 255, 0.05)",
                                            },
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                label={`#${index + 1}`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    background:
                                                        index === 0
                                                            ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                                                            : index === 1
                                                                ? "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)"
                                                                : index === 2
                                                                    ? "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)"
                                                                    : "rgba(255, 255, 255, 0.1)",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600 }}>{team.team_name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={team.team_type === "innocent" ? <Shield /> : <Dangerous />}
                                                label={team.team_type === "innocent" ? "Innocent" : "Traitor"}
                                                size="small"
                                                sx={{
                                                    background:
                                                        team.team_type === "innocent"
                                                            ? "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)"
                                                            : "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{team.member_count}/4</TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: "1.25rem",
                                                    color: "warning.main",
                                                }}
                                            >
                                                {team.total_score}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
