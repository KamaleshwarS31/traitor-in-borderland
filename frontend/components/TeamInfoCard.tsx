"use client";

import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { Group } from "@mui/icons-material";

interface TeamMember {
    id: number;
    email: string;
    role: string;
}

interface Team {
    id: number;
    team_name: string;
    team_code: string;
    total_score: number;
    members: TeamMember[];
    qr_code_image?: string;
    team_type?: "innocent" | "traitor";
}

interface TeamInfoCardProps {
    team: Team;
    isTeamLead?: boolean;
}

export default function TeamInfoCard({ team, isTeamLead = false }: TeamInfoCardProps) {
    const getBackground = () => {
        if (team.team_type === "traitor") return "linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)";
        if (team.team_type === "innocent") return "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)";
        return "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)";
    };

    return (
        <Card sx={{
            mb: 3,
            background: getBackground(),
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: 3
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: "#3B82F6", fontWeight: 700, letterSpacing: 1 }}>
                            MY TEAM
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "white" }}>
                            {team.team_name}
                        </Typography>
                        {isTeamLead && (
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 0.5, fontFamily: "monospace" }}>
                                Code: <span style={{ color: "#fff", fontWeight: 700 }}>{team.team_code}</span>
                            </Typography>
                        )}
                    </Box>
                    <Chip
                        label={`${team.total_score} pts`}
                        sx={{
                            bgcolor: "rgba(234, 179, 8, 0.2)",
                            color: "#EAB308",
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            height: 40,
                            borderRadius: 2
                        }}
                    />
                </Box>

                {isTeamLead && team.qr_code_image && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3, p: 2, bgcolor: "white", borderRadius: 2, width: "fit-content", mx: "auto" }}>
                        {/* Use img tag for Data URL */}
                        <img src={team.qr_code_image} alt="Team QR" style={{ width: 180, height: 180 }} />
                        <Typography variant="caption" sx={{ color: "black", fontWeight: 700, mt: 1 }}>
                            SCAN TO JOIN
                        </Typography>
                    </Box>
                )}

                <Box>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", mb: 1, display: "block" }}>
                        MEMBERS
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {team.members.map((m) => (
                            <Chip
                                key={m.id}
                                label={m.email.split("@")[0]}
                                size="small"
                                icon={m.role === "team_lead" ? <Group fontSize="small" /> : undefined}
                                sx={{
                                    bgcolor: m.role === "team_lead" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.1)",
                                    color: m.role === "team_lead" ? "#60A5FA" : "rgba(255,255,255,0.8)",
                                    border: m.role === "team_lead" ? "1px solid rgba(59, 130, 246, 0.3)" : "none"
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
