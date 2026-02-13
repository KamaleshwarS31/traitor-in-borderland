"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
    AppBar,
    Toolbar,
    IconButton,
    Chip,
} from "@mui/material";
import {
    Logout,
    LocationOn,
    QrCode2,
    People,
    Settings,
    PlayArrow,
    Refresh,
    EmojiEvents,
    Block,
    Analytics,
    Group,
    Person,
} from "@mui/icons-material";
import LocationsManager from "@/components/admin/LocationsManager";
import GoldBarsManager from "@/components/admin/GoldBarsManager";
import TeamLeadsManager from "@/components/admin/TeamLeadsManager";
import ParticipantsManager from "@/components/admin/ParticipantsManager";
import TeamsManager from "@/components/admin/TeamsManager";
import AssignmentCardsGenerator from "@/components/admin/AssignmentCardsGenerator";
import GameSettings from "@/components/admin/GameSettings";
import RoundControl from "@/components/admin/RoundControl";
import LiveLeaderboard from "@/components/admin/LiveLeaderboard";
import TeamsByType from "@/components/admin/TeamsByType";
import SabotageMonitor from "@/components/admin/SabotageMonitor";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function AdminDashboard() {
    const router = useRouter();
    const { userData, signOut } = useAuth();
    const { joinAdmin } = useSocket();
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        // Join admin room for real-time updates
        joinAdmin();
    }, [joinAdmin]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <ProtectedRoute allowedRoles={["master_admin"]}>
            <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
                {/* App Bar */}
                <AppBar
                    position="sticky"
                    sx={{
                        background: "rgba(30, 41, 59, 0.9)",
                        backdropFilter: "blur(10px)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                            <span className="gradient-text">Master Admin Dashboard</span>
                        </Typography>
                        <Chip
                            label={userData?.email}
                            color="primary"
                            sx={{ mr: 2 }}
                        />
                        <IconButton color="inherit" onClick={handleSignOut}>
                            <Logout />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ py: 4 }}>
                    {/* Welcome Section */}
                    <Box sx={{ mb: 4 }} className="fade-in">
                        <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
                            Welcome, Master Admin
                        </Typography>
                        <Typography variant="body1" sx={{ color: "text.secondary" }}>
                            Control the entire Traitor in Borderland game from this dashboard
                        </Typography>
                    </Box>

                    {/* Main Tabs */}
                    <Card
                        sx={{
                            mb: 3,
                            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <Tabs
                            value={currentTab}
                            onChange={(e, newValue) => setCurrentTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                "& .MuiTab-root": {
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                },
                            }}
                        >
                            <Tab icon={<Analytics />} label="Analytics" iconPosition="start" />
                            <Tab icon={<EmojiEvents />} label="Leaderboard" iconPosition="start" />
                            <Tab icon={<PlayArrow />} label="Game Control" iconPosition="start" />
                            <Tab icon={<Block />} label="Sabotages" iconPosition="start" />
                            <Tab icon={<LocationOn />} label="Locations" iconPosition="start" />
                            <Tab icon={<QrCode2 />} label="Gold Bars" iconPosition="start" />
                            <Tab icon={<People />} label="Team Leads" iconPosition="start" />
                            <Tab icon={<Person />} label="Participants" iconPosition="start" />
                            <Tab icon={<Group />} label="Teams" iconPosition="start" />
                            <Tab icon={<QrCode2 />} label="Assignment Cards" iconPosition="start" />
                            <Tab icon={<Settings />} label="Settings" iconPosition="start" />
                        </Tabs>
                    </Card>

                    {/* Tab Panels */}
                    <Box className="fade-in">
                        {currentTab === 0 && <AnalyticsDashboard />}
                        {currentTab === 1 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={8}>
                                    <LiveLeaderboard />
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <TeamsByType />
                                </Grid>
                            </Grid>
                        )}
                        {currentTab === 2 && <RoundControl />}
                        {currentTab === 3 && <SabotageMonitor />}
                        {currentTab === 4 && <LocationsManager />}
                        {currentTab === 5 && <GoldBarsManager />}
                        {currentTab === 6 && <TeamLeadsManager />}
                        {currentTab === 7 && <ParticipantsManager />}
                        {currentTab === 8 && <TeamsManager />}
                        {currentTab === 9 && <AssignmentCardsGenerator />}
                        {currentTab === 10 && <GameSettings />}
                    </Box>
                </Container>
            </Box>
        </ProtectedRoute>
    );
}
