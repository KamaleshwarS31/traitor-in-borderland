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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Block, CheckCircle, Warning } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface Sabotage {
    id: number;
    saboteur_team_name: string;
    victim_team_name: string;
    sabotage_time: string;
    end_time: string;
    is_active: boolean;
}

export default function SabotageMonitor() {
    const [sabotages, setSabotages] = useState<Sabotage[]>([]);
    const [loading, setLoading] = useState(true);
    const [overruleDialog, setOverruleDialog] = useState(false);
    const [selectedSabotage, setSelectedSabotage] = useState<Sabotage | null>(null);
    const [overruling, setOverruling] = useState(false);

    const fetchSabotages = async () => {
        try {
            const response = await adminAPI.getSabotages();
            setSabotages(response.data);
        } catch (error) {
            console.error("Error fetching sabotages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSabotages();
        // Refresh every 5 seconds
        const interval = setInterval(fetchSabotages, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleOverrule = async () => {
        if (!selectedSabotage) return;

        setOverruling(true);
        try {
            await adminAPI.overruleSabotage(selectedSabotage.id);
            await fetchSabotages();
            setOverruleDialog(false);
            setSelectedSabotage(null);
        } catch (error: any) {
            console.error("Error overruling sabotage:", error);
            alert(error.response?.data?.message || "Failed to overrule sabotage");
        } finally {
            setOverruling(false);
        }
    };

    const activeSabotages = sabotages.filter(s => s.is_active);
    const pastSabotages = sabotages.filter(s => !s.is_active);

    return (
        <>
            <Card
                sx={{
                    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Sabotage Monitor
                        </Typography>
                        <Chip
                            label={`${activeSabotages.length} Active`}
                            color={activeSabotages.length > 0 ? "error" : "success"}
                            icon={activeSabotages.length > 0 ? <Warning /> : <CheckCircle />}
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Active Sabotages */}
                            {activeSabotages.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, color: "error.main", fontWeight: 600 }}>
                                        🔴 Active Sabotages
                                    </Typography>
                                    <List>
                                        {activeSabotages.map((sabotage) => (
                                            <ListItem
                                                key={sabotage.id}
                                                sx={{
                                                    mb: 1,
                                                    borderRadius: 2,
                                                    background: "rgba(239, 68, 68, 0.1)",
                                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {sabotage.saboteur_team_name} → {sabotage.victim_team_name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption">
                                                            Ends: {new Date(sabotage.end_time).toLocaleTimeString()}
                                                        </Typography>
                                                    }
                                                />
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    startIcon={<Block />}
                                                    onClick={() => {
                                                        setSelectedSabotage(sabotage);
                                                        setOverruleDialog(true);
                                                    }}
                                                >
                                                    Overrule
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Past Sabotages */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    📜 Sabotage History
                                </Typography>
                                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                                    {pastSabotages.length === 0 ? (
                                        <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                            No past sabotages
                                        </Typography>
                                    ) : (
                                        pastSabotages.map((sabotage) => (
                                            <ListItem
                                                key={sabotage.id}
                                                sx={{
                                                    mb: 1,
                                                    borderRadius: 2,
                                                    background: "rgba(255, 255, 255, 0.05)",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2">
                                                            {sabotage.saboteur_team_name} → {sabotage.victim_team_name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption">
                                                            {new Date(sabotage.sabotage_time).toLocaleString()}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))
                                    )}
                                </List>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Overrule Confirmation Dialog */}
            <Dialog open={overruleDialog} onClose={() => !overruling && setOverruleDialog(false)}>
                <DialogTitle>Overrule Sabotage?</DialogTitle>
                <DialogContent>
                    {selectedSabotage && (
                        <Typography>
                            Are you sure you want to overrule the sabotage from{" "}
                            <strong>{selectedSabotage.saboteur_team_name}</strong> on{" "}
                            <strong>{selectedSabotage.victim_team_name}</strong>?
                            <br />
                            <br />
                            This will immediately end the sabotage and notify the victim team.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOverruleDialog(false)} disabled={overruling}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleOverrule}
                        variant="contained"
                        color="error"
                        disabled={overruling}
                        startIcon={<Block />}
                    >
                        {overruling ? "Overruling..." : "Overrule"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
