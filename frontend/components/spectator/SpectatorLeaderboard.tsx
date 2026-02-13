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
    CircularProgress
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { gameAPI } from "@/lib/api";
import socket from "@/lib/socket";

interface Team {
    id: number;
    team_name: string;
    team_type: string; // We have it in data but won't show it
    total_score: number;
    member_count: string;
}

export default function SpectatorLeaderboard() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const response = await gameAPI.getLeaderboard();
            setTeams(response.data);
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
            setTeams(updatedTeams);
        });

        // Also listen for score updates directly if needed, but leaderboard_update covers it usually
        // Also listen for score updates directly if needed, but leaderboard_update covers it usually
        socket.on("score_update", () => {
            fetchLeaderboard();
        });

        socket.on("leaderboard_visibility", (data: { visible: boolean }) => {
            if (data.visible) fetchLeaderboard();
            else setTeams([]);
        });

        return () => {
            socket.off("leaderboard_update");
            socket.off("score_update");
            socket.off("leaderboard_visibility");
        };
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <Card sx={{
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
        }}>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <EmojiEvents sx={{ fontSize: 40, color: "#F59E0B", mr: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                        Live Standings
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "1.1rem" }}>RANK</TableCell>
                                <TableCell sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "1.1rem" }}>TEAM</TableCell>
                                <TableCell align="right" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "1.1rem" }}>SCORE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.map((team, index) => (
                                <TableRow
                                    key={team.id}
                                    sx={{
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                                        transition: "background 0.3s"
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 900,
                                            fontSize: "1.2rem",
                                            background: index === 0 ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" :
                                                index === 1 ? "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)" :
                                                    index === 2 ? "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)" :
                                                        "rgba(255,255,255,0.1)",
                                            color: "white",
                                            boxShadow: index < 3 ? "0 4px 12px rgba(0,0,0,0.3)" : "none"
                                        }}>
                                            {index + 1}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                                            {team.team_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h4" sx={{
                                            fontWeight: 900,
                                            color: "#F59E0B",
                                            textShadow: "0 0 20px rgba(245, 158, 11, 0.5)"
                                        }}>
                                            {team.total_score}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {teams.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 8, color: "rgba(255,255,255,0.5)" }}>
                                        <Typography variant="h6">Game setup in progress...</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
