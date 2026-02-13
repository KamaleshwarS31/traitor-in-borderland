"use client";

import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

interface GameTimerProps {
    endTime: string | Date | null;
    isActive: boolean;
}

export default function GameTimer({ endTime, isActive }: GameTimerProps) {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!isActive || !endTime) {
            setTimeLeft("--:--");
            return;
        }

        const tick = () => {
            const end = new Date(endTime).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft("00:00");
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        tick(); // Immediate update
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [endTime, isActive]);

    return (
        <Box sx={{
            textAlign: 'center',
            p: 1.5,
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 100
        }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Time Remaining
            </Typography>
            <Typography variant="h5" sx={{
                fontWeight: 700,
                fontFamily: 'monospace',
                color: isActive ? '#10B981' : 'text.secondary',
                lineHeight: 1
            }}>
                {isActive ? timeLeft : "--:--"}
            </Typography>
        </Box>
    );
}
