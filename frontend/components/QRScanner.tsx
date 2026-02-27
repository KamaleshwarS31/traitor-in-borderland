"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Button, Typography, Paper, TextField } from "@mui/material";
import { QrCodeScanner, Close } from "@mui/icons-material";

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
    allowManualEntry?: boolean;
    manualEntryLabel?: string;
    manualEntryPlaceholder?: string;
}

export default function QRScanner({
    onScan,
    onClose,
    allowManualEntry = false,
    manualEntryLabel = "Can't scan? Enter code manually",
    manualEntryPlaceholder = "Enter 6-digit code"
}: QRScannerProps) {
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState("");
    const [manualCode, setManualCode] = useState("");
    const [showManual, setShowManual] = useState(false);

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                const scanner = scannerRef.current;
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
                    // Ignore scan errors
                }
            );

            setScanning(true);
            setShowManual(false);
        } catch (err: any) {
            console.error("Scanner error:", err);
            setError("Failed to start camera. Please allow camera access.");
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch (err: any) {
                if (err?.message && !err.message.includes("not running")) {
                    console.error("Stop scanner error:", err);
                }
            } finally {
                scannerRef.current = null;
                setScanning(false);
            }
        }
    };

    const handleManualSubmit = () => {
        if (!manualCode) return;
        onScan(manualCode);
        onClose();
    };

    return (
        <Paper
            sx={{
                p: { xs: 2, sm: 3 },
                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
                width: "100%",
                maxWidth: 500
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
                    sx={{ borderColor: "rgba(255, 255, 255, 0.3)", color: "white" }}
                >
                    Close
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center", fontSize: "0.875rem" }}>
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
                    display: showManual ? "none" : "block",
                    background: "rgba(0,0,0,0.3)",
                    aspectRatio: "1/1",
                    "& video": {
                        borderRadius: 2,
                        objectFit: "cover"
                    },
                }}
            />

            {showManual && (
                <Box sx={{ py: 4, px: 2, textAlign: "center", background: "rgba(0,0,0,0.2)", borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        Enter the unique 6-digit code from the gold bar
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder={manualEntryPlaceholder}
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        autoFocus
                        inputProps={{
                            maxLength: 10,
                            sx: {
                                textAlign: "center",
                                fontSize: "1.5rem",
                                fontWeight: 900,
                                letterSpacing: 8,
                                fontFamily: "monospace",
                                color: "#EAB308"
                            }
                        }}
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(234, 179, 8, 0.3)" },
                                "&:hover fieldset": { borderColor: "rgba(234, 179, 8, 0.5)" },
                                "&.Mui-focused fieldset": { borderColor: "#EAB308" },
                            }
                        }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleManualSubmit}
                        disabled={!manualCode}
                        sx={{
                            background: "linear-gradient(135deg, #EAB308 0%, #D97706 100%)",
                            color: "black",
                            fontWeight: 700,
                            py: 1.5
                        }}
                    >
                        SUBMIT CODE
                    </Button>
                </Box>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {!scanning && !showManual && (
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
                        Use Camera
                    </Button>
                )}

                {scanning && (
                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={stopScanning}
                        sx={{ borderColor: "rgba(255, 255, 255, 0.3)", color: "white" }}
                    >
                        Stop Camera
                    </Button>
                )}

                {allowManualEntry && !scanning && (
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => setShowManual(!showManual)}
                        sx={{ color: showManual ? "text.secondary" : "#EAB308" }}
                    >
                        {showManual ? "← Back to scanner" : manualEntryLabel}
                    </Button>
                )}
            </Box>

            {!showManual && (
                <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2, color: "text.secondary" }}>
                    Point camera at gold bar QR code or enter code manually
                </Typography>
            )}
        </Paper>
    );
}

