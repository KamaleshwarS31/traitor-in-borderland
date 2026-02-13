"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    CircularProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import {
    EmojiEvents,
    Groups,
    Stars,
    LocalFireDepartment,
    TrendingUp,
} from "@mui/icons-material";
import { adminAPI } from "@/lib/api";

interface Analytics {
    game_state: any;
    teams: {
        total: string;
        innocents: string;
        traitors: string;
    };
    gold_bars: {
        total: string;
        scanned: string;
        remaining: string;
        points_collected: string;
    };
    sabotages: {
        total_sabotages: string;
        active_sabotages: string;
    };
    top_teams: Array<{
        team_name: string;
        team_type: string;
        total_score: number;
    }>;
    recent_scans: Array<{
        team_name: string;
        points: number;
        scanned_at: string;
    }>;
    team_performance: Array<{
        team_name: string;
        team_type: string;
        total_score: number;
        gold_bars_collected: string;
        sabotages_performed: string;
        times_sabotaged: string;
    }>;
}

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const response = await adminAPI.getAnalytics();
            setAnalytics(response.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        // Refresh every 10 seconds
        const interval = setInterval(fetchAnalytics, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!analytics) {
        return (
            <Typography color="text.secondary" align="center">
                No analytics data available
            </Typography>
        );
    }

    const StatCard = ({ title, value, icon, color }: any) => (
        <Card
            sx={{
                background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                border: `1px solid ${color}30`,
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            background: `${color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Teams"
                        value={analytics.teams.total}
                        icon={<Groups sx={{ fontSize: 32, color: "#3B82F6" }} />}
                        color="#3B82F6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Gold Bars Remaining"
                        value={`${analytics.gold_bars.remaining}/${analytics.gold_bars.total}`}
                        icon={<Stars sx={{ fontSize: 32, color: "#F59E0B" }} />}
                        color="#F59E0B"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Sabotages"
                        value={analytics.sabotages.active_sabotages}
                        icon={<LocalFireDepartment sx={{ fontSize: 32, color: "#EF4444" }} />}
                        color="#EF4444"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Points Collected"
                        value={analytics.gold_bars.points_collected || 0}
                        icon={<TrendingUp sx={{ fontSize: 32, color: "#10B981" }} />}
                        color="#10B981"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Top Teams */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <EmojiEvents sx={{ color: "#F59E0B" }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Top 5 Teams
                                </Typography>
                            </Box>
                            <List>
                                {analytics.top_teams.map((team, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            mb: 1,
                                            borderRadius: 2,
                                            background:
                                                team.team_type === "innocent"
                                                    ? "rgba(59, 130, 246, 0.1)"
                                                    : "rgba(239, 68, 68, 0.1)",
                                            border:
                                                team.team_type === "innocent"
                                                    ? "1px solid rgba(59, 130, 246, 0.3)"
                                                    : "1px solid rgba(239, 68, 68, 0.3)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                background:
                                                    index === 0
                                                        ? "#F59E0B"
                                                        : index === 1
                                                            ? "#9CA3AF"
                                                            : index === 2
                                                                ? "#CD7F32"
                                                                : "rgba(255, 255, 255, 0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 700,
                                                mr: 2,
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <ListItemText
                                            primary={team.team_name}
                                            primaryTypographyProps={{ component: "div" }}
                                            secondary={
                                                <Chip
                                                    label={team.team_type}
                                                    size="small"
                                                    sx={{ mt: 0.5 }}
                                                    color={team.team_type === "innocent" ? "primary" : "error"}
                                                />
                                            }
                                            secondaryTypographyProps={{ component: "div" }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {team.total_score}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                📊 Recent Scans
                            </Typography>
                            <List sx={{ maxHeight: 300, overflow: "auto" }}>
                                {analytics.recent_scans.length === 0 ? (
                                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                        No scans yet
                                    </Typography>
                                ) : (
                                    analytics.recent_scans.map((scan, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                mb: 1,
                                                borderRadius: 2,
                                                background: "rgba(16, 185, 129, 0.1)",
                                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {scan.team_name}
                                                        </Typography>
                                                        <Chip
                                                            label={`+${scan.points} pts`}
                                                            size="small"
                                                            color="success"
                                                        />
                                                    </Box>
                                                }
                                                primaryTypographyProps={{ component: "div" }}
                                                secondary={
                                                    <Typography variant="caption" component="span">
                                                        {new Date(scan.scanned_at).toLocaleString()}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Team Performance */}
                <Grid size={{ xs: 12 }}>
                    <Card
                        sx={{
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                🎯 Team Performance
                            </Typography>
                            <Box sx={{ overflowX: "auto" }}>
                                <Box sx={{ minWidth: 800 }}>
                                    {/* Header */}
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                                            gap: 2,
                                            p: 2,
                                            background: "rgba(255, 255, 255, 0.05)",
                                            borderRadius: 2,
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Team
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Type
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Score
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Gold Bars
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Sabotaged
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            Got Sabotaged
                                        </Typography>
                                    </Box>

                                    {/* Rows */}
                                    {analytics.team_performance.map((team, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                                                gap: 2,
                                                p: 2,
                                                background:
                                                    team.team_type === "innocent"
                                                        ? "rgba(59, 130, 246, 0.05)"
                                                        : "rgba(239, 68, 68, 0.05)",
                                                borderRadius: 2,
                                                mb: 1,
                                                border:
                                                    team.team_type === "innocent"
                                                        ? "1px solid rgba(59, 130, 246, 0.2)"
                                                        : "1px solid rgba(239, 68, 68, 0.2)",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {team.team_name}
                                            </Typography>
                                            <Chip
                                                label={team.team_type}
                                                size="small"
                                                color={team.team_type === "innocent" ? "primary" : "error"}
                                            />
                                            <Typography variant="body2">{team.total_score}</Typography>
                                            <Typography variant="body2">{team.gold_bars_collected}</Typography>
                                            <Typography variant="body2">{team.sabotages_performed}</Typography>
                                            <Typography variant="body2">{team.times_sabotaged}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
