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
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Person, Delete, VerifiedUser } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface Participant {
    id: number;
    email: string;
    role: string;
    created_at: string;
}

export default function ParticipantsManager() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchParticipants = async () => {
        try {
            const response = await adminAPI.getParticipants();
            setParticipants(response.data);
        } catch (error) {
            console.error("Error fetching participants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const handlePromote = async (id: number) => {
        if (!confirm("Are you sure you want to promote this user to Team Lead?")) return;
        try {
            await adminAPI.promoteParticipant(id);
            fetchParticipants();
        } catch (error) {
            console.error("Error promoting user:", error);
            alert("Failed to promote user");
        }
    };

    const handleRemove = async (id: number) => {
        if (!confirm("Are you sure you want to remove this user from the game? This action cannot be undone.")) return;
        try {
            await adminAPI.removeParticipant(id);
            fetchParticipants();
        } catch (error) {
            console.error("Error removing user:", error);
            alert("Failed to remove user");
        }
    };

    return (
        <Card
            sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                    Participants Manager
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {participants.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                No participants found
                            </Typography>
                        ) : (
                            participants.map((user) => (
                                <ListItem
                                    key={user.id}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                    secondaryAction={
                                        <Box>
                                            {user.role === "member" && (
                                                <Tooltip title="Promote to Team Lead">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handlePromote(user.id)}
                                                    >
                                                        <VerifiedUser />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Remove from Game">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemove(user.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                >
                                    <Person sx={{ mr: 2, color: "text.secondary" }} />
                                    <ListItemText
                                        primary={user.email}
                                        secondaryTypographyProps={{ component: "div" }}
                                        secondary={
                                            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    color={user.role === 'team_lead' ? "success" : "default"}
                                                />
                                                <Typography variant="caption" sx={{ alignSelf: 'center', color: 'text.secondary' }}>
                                                    Joined: {new Date(user.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
