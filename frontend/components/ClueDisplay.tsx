"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

interface ClueDisplayProps {
    clue: string | null;
}

export default function ClueDisplay({ clue }: ClueDisplayProps) {
    return (
        <Card sx={{
            mb: 3,
            bgcolor: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 3,
            backdropFilter: "blur(10px)"
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Search sx={{ color: "#A855F7", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#E2E8F0" }}>
                        Current Clue
                    </Typography>
                </Box>

                <Box sx={{
                    p: 2,
                    bgcolor: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                    borderLeft: "4px solid #A855F7"
                }}>
                    <Typography variant="body1" sx={{
                        color: "rgba(255,255,255,0.9)",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        lineHeight: 1.6
                    }}>
                        "{clue || "Wait for the next clue..."}"
                    </Typography>
                </Box>

                <Typography variant="caption" sx={{ display: "block", mt: 2, color: "rgba(255,255,255,0.5)" }}>
                    Find the location described and scan the Gold Bar QR code.
                </Typography>
            </CardContent>
        </Card>
    );
}
