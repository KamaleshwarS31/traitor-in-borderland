"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Button, Typography, Paper } from "@mui/material";
import { QrCodeScanner, Close } from "@mui/icons-material";

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                // Try strictly stopping the scanner instance directly
                // We use a local reference to ensure we are stopping the correct instance
                const scanner = scannerRef.current;

                // .stop() returns a Promise. We must catch errors to prevent unhandled rejections/crashes
                // specifically "scanner is not running" which is common during unmounts
                scanner.stop().catch((err) => {
                    const msg = err?.message || err?.toString() || "";
                    if (!msg.includes("not running") && !msg.includes("is not running")) {
                        console.warn("QR Scanner cleanup warning:", err);
                    }
                });
            }
        };
    }, []);

    const startScanning = async () => {
        try {
            setError("");
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    onScan(decodedText);
                    stopScanning();
                },
                (errorMessage) => {
                    // Ignore scan errors (happens continuously while scanning)
                }
            );

            setScanning(true);
        } catch (err: any) {
            console.error("Scanner error:", err);
            setError("Failed to start camera. Please allow camera access.");
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                // Check if scanner is running before stopping to avoid "not running" error
                // Html5Qrcode doesn't expose a clean isRunning method, so we blindly try stop
                // and catch the specific error if it happens.
                await scannerRef.current.stop();
            } catch (err: any) {
                // Ignore "not running" error
                if (err?.message && !err.message.includes("not running")) {
                    console.error("Stop scanner error:", err);
                }
            } finally {
                scannerRef.current = null;
                setScanning(false);
            }
        }
    };

    return (
        <Paper
            sx={{
                p: 3,
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    QR Code Scanner
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onClose}
                    startIcon={<Close />}
                    sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                >
                    Close
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box
                id="qr-reader"
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    mx: "auto",
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    "& video": {
                        borderRadius: 2,
                    },
                }}
            />

            {!scanning && (
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={startScanning}
                    startIcon={<QrCodeScanner />}
                    sx={{
                        background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                        },
                    }}
                >
                    Start Scanning
                </Button>
            )}

            {scanning && (
                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={stopScanning}
                    sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                >
                    Stop Scanning
                </Button>
            )}

            <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2, color: "text.secondary" }}>
                Point your camera at a QR code to scan
            </Typography>
        </Paper>
    );
}
