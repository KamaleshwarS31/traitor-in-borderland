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
    Switch,
    FormControlLabel,
    Divider,
    Chip,
} from "@mui/material";
import { Save, FlashOn, FlashOff, QrCodeScanner } from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

export default function GameSettings() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [sabotageToggling, setSabotageToggling] = useState(false);
    const [scanLimitSaving, setScanLimitSaving] = useState(false);
    const [settings, setSettings] = useState({
        total_rounds: "",
        round_duration: "",
        sabotage_duration: "",
        sabotage_cooldown: "",
        sabotage_same_person_cooldown: "",
    });
    const [sabotageEnabled, setSabotageEnabled] = useState(true);
    const [scanLimit, setScanLimit] = useState("4");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await adminAPI.getGameSettings();

                if (response.data) {
                    setSettings({
                        total_rounds: (response.data.total_rounds || 4).toString(),
                        round_duration: ((response.data.round_duration || 600) / 60).toString(),
                        sabotage_duration: (response.data.sabotage_duration || 60).toString(),
                        sabotage_cooldown: (response.data.sabotage_cooldown || 120).toString(),
                        sabotage_same_person_cooldown: (response.data.sabotage_same_person_cooldown || 300).toString(),
                    });
                    // sabotage_enabled defaults to true if not set
                    setSabotageEnabled(response.data.sabotage_enabled !== false);
                    setScanLimit((response.data.scan_limit || 4).toString());
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
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

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setErrorMsg("");
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setSuccessMsg("");
    };

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
            showSuccess("Game settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            showError("Failed to update settings");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleSabotage = async () => {
        setSabotageToggling(true);
        try {
            const newValue = !sabotageEnabled;
            await adminAPI.toggleSabotage(newValue);
            setSabotageEnabled(newValue);
            showSuccess(
                newValue
                    ? "Sabotage enabled! All traitors have been notified."
                    : "Sabotage disabled. Traitors cannot sabotage until re-enabled."
            );
        } catch (error) {
            console.error("Error toggling sabotage:", error);
            showError("Failed to toggle sabotage feature");
        } finally {
            setSabotageToggling(false);
        }
    };

    const handleSaveScanLimit = async () => {
        const limit = parseInt(scanLimit);
        if (isNaN(limit) || limit < 1) {
            showError("Scan limit must be a positive number");
            return;
        }
        setScanLimitSaving(true);
        try {
            await adminAPI.updateScanLimit(limit);
            showSuccess(`Scan limit updated to ${limit} scans per round`);
        } catch (error) {
            console.error("Error updating scan limit:", error);
            showError("Failed to update scan limit");
        } finally {
            setScanLimitSaving(false);
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {successMsg && (
                <Alert severity="success" onClose={() => setSuccessMsg("")}>
                    {successMsg}
                </Alert>
            )}
            {errorMsg && (
                <Alert severity="error" onClose={() => setErrorMsg("")}>
                    {errorMsg}
                </Alert>
            )}

            {/* ─── Sabotage Toggle ─── */}
            <Card
                sx={{
                    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                    border: `1px solid ${sabotageEnabled ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Sabotage Feature
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enable or disable the sabotage mechanic for traitor teams. When enabled, all traitors receive a notification.
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                            <Chip
                                icon={sabotageEnabled ? <FlashOn /> : <FlashOff />}
                                label={sabotageEnabled ? "ENABLED" : "DISABLED"}
                                color={sabotageEnabled ? "error" : "default"}
                                sx={{ fontWeight: 700, letterSpacing: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleToggleSabotage}
                                disabled={sabotageToggling}
                                startIcon={sabotageToggling ? <CircularProgress size={16} /> : (sabotageEnabled ? <FlashOff /> : <FlashOn />)}
                                sx={{
                                    minWidth: 130,
                                    background: sabotageEnabled
                                        ? "linear-gradient(135deg, #64748B 0%, #475569 100%)"
                                        : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                                    fontWeight: 700,
                                    "&:hover": {
                                        background: sabotageEnabled
                                            ? "linear-gradient(135deg, #475569 0%, #334155 100%)"
                                            : "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                                    },
                                }}
                            >
                                {sabotageToggling ? "Toggling..." : (sabotageEnabled ? "Disable" : "Enable")}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* ─── Scan Limit ─── */}
            <Card
                sx={{
                    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Scan Limit per Team per Round
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Set how many gold bars each team can scan per round. Currently: <strong>{scanLimit}</strong>
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <TextField
                            label="Max Scans per Round"
                            type="number"
                            value={scanLimit}
                            onChange={(e) => setScanLimit(e.target.value)}
                            inputProps={{ min: 1, max: 20 }}
                            sx={{ flex: 1 }}
                            helperText="Number of gold bars each team can scan per round"
                        />
                        <Button
                            variant="contained"
                            onClick={handleSaveScanLimit}
                            disabled={scanLimitSaving}
                            startIcon={scanLimitSaving ? <CircularProgress size={16} /> : <QrCodeScanner />}
                            sx={{
                                py: 1.8,
                                px: 3,
                                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                fontWeight: 700,
                                "&:hover": {
                                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                },
                            }}
                        >
                            {scanLimitSaving ? "Saving..." : "Save Limit"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* ─── Main Game Settings ─── */}
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
                            <Grid size={{ xs: 12, md: 6 }}>
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

                            <Grid size={{ xs: 12, md: 6 }}>
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
        </Box>
    );
}
