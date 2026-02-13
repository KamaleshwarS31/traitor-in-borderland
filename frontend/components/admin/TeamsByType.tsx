"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Divider,
} from "@mui/material";
import { Shield, Dangerous } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface TeamInfo {
    id: number;
    team_name: string;
    team_code: string;
    total_score: number;
}

export default function TeamsByType() {
    const [innocents, setInnocents] = useState<TeamInfo[]>([]);
    const [traitors, setTraitors] = useState<TeamInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await adminAPI.getTeamsByType();
                setInnocents(response.data.innocents || []);
                setTraitors(response.data.traitors || []);
            } catch (error) {
                console.error("Error fetching teams by type:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardContent sx={{ display: "flex", justifyContent: "center", py: 4 }}>
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
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                    Teams by Type
                </Typography>

                {/* Innocents */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Shield sx={{ color: "#3B82F6", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Innocents
                        </Typography>
                        <Chip
                            label={innocents.length}
                            size="small"
                            sx={{ ml: 1, bgcolor: "rgba(59, 130, 246, 0.2)" }}
                        />
                    </Box>
                    <List dense>
                        {innocents.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                No innocent teams yet
                            </Typography>
                        ) : (
                            innocents.map((team) => (
                                <ListItem
                                    key={team.id}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        background: "rgba(59, 130, 246, 0.1)",
                                        border: "1px solid rgba(59, 130, 246, 0.2)",
                                    }}
                                >
                                    <ListItemText
                                        primary={team.team_name}
                                        secondary={`Code: ${team.team_code} • Score: ${team.total_score}`}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Traitors */}
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Dangerous sx={{ color: "#EF4444", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Traitors
                        </Typography>
                        <Chip
                            label={traitors.length}
                            size="small"
                            sx={{ ml: 1, bgcolor: "rgba(239, 68, 68, 0.2)" }}
                        />
                    </Box>
                    <List dense>
                        {traitors.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                No traitor teams yet
                            </Typography>
                        ) : (
                            traitors.map((team) => (
                                <ListItem
                                    key={team.id}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        background: "rgba(239, 68, 68, 0.1)",
                                        border: "1px solid rgba(239, 68, 68, 0.2)",
                                    }}
                                >
                                    <ListItemText
                                        primary={team.team_name}
                                        secondary={`Code: ${team.team_code} • Score: ${team.total_score}`}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
}
