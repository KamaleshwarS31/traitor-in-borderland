"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
} from "@mui/material";
import { Add, Person } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface TeamLead {
    id: number;
    email: string;
    team_name: string | null;
    team_code: string | null;
    team_type: string | null;
}

export default function TeamLeadsManager() {
    const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchTeamLeads = async () => {
        try {
            const response = await adminAPI.getTeamLeads();
            setTeamLeads(response.data);
        } catch (error) {
            console.error("Error fetching team leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamLeads();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await adminAPI.createTeamLead({ email });
            setEmail("");
            await fetchTeamLeads();
        } catch (error: any) {
            console.error("Error creating team lead:", error);
            alert(error.response?.data?.message || "Failed to create team lead");
        } finally {
            setSubmitting(false);
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
                    Team Leads Manager
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="VIT Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        placeholder="teamlead@vit.ac.in"
                        helperText="Must be a valid VIT email address"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Add />}
                        disabled={submitting}
                        fullWidth
                    >
                        {submitting ? "Creating..." : "Create Team Lead"}
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {teamLeads.length === 0 ? (
                            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                No team leads yet
                            </Typography>
                        ) : (
                            teamLeads.map((lead) => (
                                <ListItem
                                    key={lead.id}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        background: lead.team_name
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(255, 255, 255, 0.05)",
                                        border: `1px solid ${lead.team_name ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.1)"
                                            }`,
                                    }}
                                    secondaryAction={
                                        <Button
                                            color="error"
                                            size="small"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this team lead?")) {
                                                    try {
                                                        await adminAPI.deleteTeamLead(lead.id);
                                                        fetchTeamLeads();
                                                    } catch (error) {
                                                        console.error("Delete error", error);
                                                        alert("Failed to delete team lead");
                                                    }
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    }
                                >
                                    <Person sx={{ mr: 2, color: "primary.main" }} />
                                    <ListItemText
                                        primary={lead.email}
                                        secondary={
                                            lead.team_name
                                                ? `Team: ${lead.team_name} (${lead.team_code})`
                                                : "No team created yet"
                                        }
                                    />
                                    {lead.team_type && (
                                        <Chip
                                            label={lead.team_type}
                                            size="small"
                                            sx={{
                                                mr: 2,
                                                background:
                                                    lead.team_type === "innocent"
                                                        ? "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)"
                                                        : "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
                                            }}
                                        />
                                    )}
                                </ListItem>
                            ))
                        )}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
