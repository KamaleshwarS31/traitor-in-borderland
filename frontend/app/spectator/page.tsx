"use client";

import { Box, Container, Typography } from "@mui/material";
import SpectatorLeaderboard from "@/components/spectator/SpectatorLeaderboard";
import GameTimer from "@/components/spectator/GameTimer";

export default function SpectatorPage() {
    return (
        <main style={{
            minHeight: "100vh",
            backgroundColor: "#0F172A",
            backgroundImage: "radial-gradient(circle at 50% 0%, #1E293B 0%, #0F172A 70%)",
            color: "white",
            overflowX: "hidden"
        }}>
            {/* Header */}
            <Box sx={{ py: 3, px: 4, display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Typography variant="h3" sx={{
                    fontWeight: 900,
                    background: "linear-gradient(to right, #3B82F6, #8B5CF6, #EF4444)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textTransform: "uppercase",
                    letterSpacing: 4
                }}>
                    Traitor in Borderland
                </Typography>
            </Box>

            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 30%" }, minWidth: 300 }}>
                        <GameTimer />

                        {/* Additional Info / Instructions for Spectators */}
                        <Box sx={{
                            mt: 4,
                            p: 4,
                            bgcolor: "rgba(255,255,255,0.03)",
                            borderRadius: 4,
                            border: "1px solid rgba(255,255,255,0.05)"
                        }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#94A3B8" }}>
                                LIVE UPDATES
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}>
                                • Leaderboard updates instantly on points collection.
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", mb: 2 }}>
                                • Watch out for sudden score drops (Sabotages)!
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)" }}>
                                • Rounds are timed - 10 minutes each.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 60%" } }}>
                        <SpectatorLeaderboard />
                    </Box>
                </Box>
            </Container>
        </main>
    );
}
