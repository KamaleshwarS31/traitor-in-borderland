"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Chip,
    Divider,
} from "@mui/material";
import { AssignmentTurnedIn, Refresh } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface Team {
    id: number;
    team_name: string;
    team_type: string;
}

interface GoldBar {
    id: number;
    points: number;
    location_name: string;
    clue_text: string;
    is_scanned: boolean;
    entry_code?: string;
}

export default function ClueAllocationManager() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [goldBars, setGoldBars] = useState<GoldBar[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedGoldBar, setSelectedGoldBar] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [teamsRes, goldBarsRes] = await Promise.all([
                adminAPI.getAllTeams(),
                adminAPI.getGoldBars(),
            ]);
            setTeams(teamsRes.data);
            setGoldBars(goldBarsRes.data.filter((gb: GoldBar) => !gb.is_scanned));
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async () => {
        if (!selectedTeam || !selectedGoldBar) {
            setError("Please select both a team and a gold bar");
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await adminAPI.assignClue({
                team_id: parseInt(selectedTeam),
                gold_bar_id: parseInt(selectedGoldBar),
            });
            setSuccess(response.data.message);
            setSelectedTeam("");
            setSelectedGoldBar("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to assign clue");
        } finally {
            setSubmitting(false);
        }
    };

    const selectedBar = goldBars.find(gb => gb.id === parseInt(selectedGoldBar));
    const selectedTeamObj = teams.find(t => t.id === parseInt(selectedTeam));

    return (
        <Card
            sx={{
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Manual Clue Allocation
                    </Typography>
                    <Button
                        size="small"
                        startIcon={<Refresh />}
                        onClick={fetchData}
                        sx={{ color: "text.secondary" }}
                    >
                        Refresh
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Manually assign a gold bar's clue to a team. Use this if automatic clue assignment fails or needs correction.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
                        {success}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Select Team</InputLabel>
                            <Select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                label="Select Team"
                            >
                                {teams.map((team) => (
                                    <MenuItem key={team.id} value={team.id}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            {team.team_name}
                                            <Chip
                                                label={team.team_type}
                                                size="small"
                                                color={team.team_type === "traitor" ? "error" : "success"}
                                                sx={{ fontSize: "0.65rem" }}
                                            />
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Select Gold Bar (to assign its clue)</InputLabel>
                            <Select
                                value={selectedGoldBar}
                                onChange={(e) => setSelectedGoldBar(e.target.value)}
                                label="Select Gold Bar (to assign its clue)"
                            >
                                {goldBars.map((bar) => (
                                    <MenuItem key={bar.id} value={bar.id}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                📍 {bar.location_name} — {bar.points} pts
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Clue: {bar.clue_text?.substring(0, 50)}...
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Preview of selection */}
                        {selectedTeamObj && selectedBar && (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 3,
                                    bgcolor: "rgba(59, 130, 246, 0.08)",
                                    border: "1px solid rgba(59, 130, 246, 0.3)",
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "#60A5FA" }}>
                                    Assignment Preview
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Team:</strong> {selectedTeamObj.team_name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Will be sent to:</strong> {selectedBar.location_name}
                                </Typography>
                                <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />
                                <Typography variant="body2" sx={{ fontStyle: "italic", color: "#94A3B8" }}>
                                    Clue: "{selectedBar.clue_text}"
                                </Typography>
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={submitting ? <CircularProgress size={18} /> : <AssignmentTurnedIn />}
                            onClick={handleAssign}
                            disabled={submitting || !selectedTeam || !selectedGoldBar}
                            sx={{
                                py: 1.5,
                                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                                fontWeight: 700,
                                "&:hover": {
                                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                                },
                                "&:disabled": {
                                    background: "rgba(255,255,255,0.1)",
                                },
                            }}
                        >
                            {submitting ? "Assigning..." : "Assign Clue to Team"}
                        </Button>

                        {goldBars.length === 0 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No unscanned gold bars available to assign clues from.
                            </Alert>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
