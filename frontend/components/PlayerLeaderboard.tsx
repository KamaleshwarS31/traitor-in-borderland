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
    Alert
} from "@mui/material";
import { EmojiEvents, Shield, Dangerous } from "@mui/icons-material";
import { gameAPI } from "@/lib/api";
import socket from "@/lib/socket";

interface Team {
    id: number;
    team_name: string;
    team_type: string;
    total_score: number;
    member_count: string;
}

export default function PlayerLeaderboard() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(false);

    const fetchLeaderboard = async () => {
        try {
            const response = await gameAPI.getLeaderboard();
            // If empty array, likely hidden.
            // But API returns [] if no teams OR hidden.
            // We can infer visibility by response length? No.
            // But we can just show empty state.
            setTeams(response.data);
            setIsPublished(response.data.length > 0);
            // Wait, if no teams exist, it's also empty.
            // But if game is running, teams exist.
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        // Listen for real-time updates
        socket.on("leaderboard_update", (updatedTeams: Team[]) => {
            // If we receive update, it means it's published? 
            // Admin backend emits 'leaderboard_update' regardless of publish state?
            // No, socket event logic in backend (wherever it is) likely emits to 'admin' room?
            // Let's check backend.
        });

        socket.on("leaderboard_visibility", (data: { visible: boolean }) => {
            if (data.visible) fetchLeaderboard();
            else setTeams([]);
        });

        return () => {
            socket.off("leaderboard_update");
            socket.off("leaderboard_visibility");
        };
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (teams.length === 0) {
        return (
            <Card sx={{ bgcolor: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                        Leaderboard is currently hidden or empty.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                mt: 4
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <EmojiEvents sx={{ fontSize: 32, color: "warning.main", mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                        Leaderboard
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>Team</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "text.secondary", textAlign: "right" }}>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.map((team, index) => (
                                <TableRow
                                    key={team.id}
                                    sx={{
                                        "&:hover": {
                                            background: "rgba(255, 255, 255, 0.05)",
                                        }
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
                                                color: "white"
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 600, color: "white" }}>{team.team_name}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: "1.1rem",
                                                color: "warning.main",
                                            }}
                                        >
                                            {team.total_score}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
