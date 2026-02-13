"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

export default function GameSettings() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [settings, setSettings] = useState({
        total_rounds: "",
        round_duration: "",
        sabotage_duration: "",
        sabotage_cooldown: "",
        sabotage_same_person_cooldown: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await adminAPI.getGameSettings();

                // Check if response data exists
                if (response.data) {
                    setSettings({
                        total_rounds: (response.data.total_rounds || 4).toString(),
                        round_duration: ((response.data.round_duration || 600) / 60).toString(),
                        sabotage_duration: (response.data.sabotage_duration || 60).toString(),
                        sabotage_cooldown: (response.data.sabotage_cooldown || 120).toString(),
                        sabotage_same_person_cooldown: (response.data.sabotage_same_person_cooldown || 300).toString(),
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                // Set default values on error
                setSettings({
                    total_rounds: "4",
                    round_duration: "10",
                    sabotage_duration: "60",
                    sabotage_cooldown: "120",
                    sabotage_same_person_cooldown: "300",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await adminAPI.updateGameSettings({
                total_rounds: parseInt(settings.total_rounds),
                round_duration: parseInt(settings.round_duration) * 60,
                sabotage_duration: parseInt(settings.sabotage_duration),
                sabotage_cooldown: parseInt(settings.sabotage_cooldown),
                sabotage_same_person_cooldown: parseInt(settings.sabotage_same_person_cooldown),
            });
            alert("Settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Failed to update settings");
        } finally {
            setSubmitting(false);
        }
    };

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
                    Game Settings
                </Typography>

                <Alert severity="warning" sx={{ mb: 3 }}>
                    <strong>Warning:</strong> Changing these settings during an active game may cause
                    unexpected behavior. It's recommended to reset the game before making changes.
                </Alert>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                                Round Settings
                            </Typography>

                            <TextField
                                fullWidth
                                label="Total Rounds"
                                type="number"
                                value={settings.total_rounds}
                                onChange={(e) => setSettings({ ...settings, total_rounds: e.target.value })}
                                required
                                sx={{ mb: 2 }}
                                helperText="Number of rounds in the game"
                                inputProps={{ min: 1, max: 10 }}
                            />

                            <TextField
                                fullWidth
                                label="Round Duration (minutes)"
                                type="number"
                                value={settings.round_duration}
                                onChange={(e) => setSettings({ ...settings, round_duration: e.target.value })}
                                required
                                sx={{ mb: 2 }}
                                helperText="Duration of each round in minutes"
                                inputProps={{ min: 1, max: 60 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                                Sabotage Settings
                            </Typography>

                            <TextField
                                fullWidth
                                label="Sabotage Duration (seconds)"
                                type="number"
                                value={settings.sabotage_duration}
                                onChange={(e) => setSettings({ ...settings, sabotage_duration: e.target.value })}
                                required
                                sx={{ mb: 2 }}
                                helperText="How long a sabotage lasts"
                                inputProps={{ min: 10, max: 300 }}
                            />

                            <TextField
                                fullWidth
                                label="Sabotage Cooldown (seconds)"
                                type="number"
                                value={settings.sabotage_cooldown}
                                onChange={(e) => setSettings({ ...settings, sabotage_cooldown: e.target.value })}
                                required
                                sx={{ mb: 2 }}
                                helperText="Time before traitor can sabotage again"
                                inputProps={{ min: 10, max: 600 }}
                            />

                            <TextField
                                fullWidth
                                label="Same Team Cooldown (seconds)"
                                type="number"
                                value={settings.sabotage_same_person_cooldown}
                                onChange={(e) =>
                                    setSettings({ ...settings, sabotage_same_person_cooldown: e.target.value })
                                }
                                required
                                sx={{ mb: 2 }}
                                helperText="Time before sabotaging same team again"
                                inputProps={{ min: 10, max: 1200 }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        disabled={submitting}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {submitting ? "Saving..." : "Save Settings"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
