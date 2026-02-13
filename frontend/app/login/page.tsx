"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6 10.23c0-.62-.05-1.19-.15-1.73H10v3.26h5.38c-.23 1.23-.92 2.27-1.96 2.96v2.45h3.17c1.85-1.7 2.92-4.21 2.92-7.14z" fill="#4285F4" />
        <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.17-2.45c-.9.6-2.04.95-3.45.95-2.6 0-4.81-1.76-5.6-4.12H1.27v2.53C2.96 17.75 6.27 20 10 20z" fill="#34A853" />
        <path d="M4.4 13.96c-.2-.61-.31-1.25-.31-1.96s.11-1.35.31-1.96V7.51H1.27C.46 9.11 0 10.96 0 13c0 2.04.46 3.89 1.27 5.49l3.13-2.53z" fill="#FBBC05" />
        <path d="M10 5.99c1.47 0 2.79.51 3.82 1.49l2.86-2.86C14.96 2.96 12.7 2 10 2 6.27 2 2.96 4.25 1.27 7.51l3.13 2.53c.79-2.36 3-4.12 5.6-4.12z" fill="#EA4335" />
    </svg>
);

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, user, userData, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user && userData) {
            if (userData.role === "master_admin") {
                router.push("/admin");
            } else if (userData.role === "team_lead") {
                router.push("/team-lead");
            } else if (userData.role === "member") {
                router.push("/member");
            }
        }
    }, [user, userData, loading, router]);

    const handleGoogleSignIn = async () => {
        setError("");
        setSubmitting(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error("Google Login error:", err);
            if (err.message && err.message.includes("Invalid VIT email")) {
                setError("Only @vit.ac.in or @vitstudent.ac.in emails are allowed");
            } else if (err.code === "auth/popup-closed-by-user") {
                setError("Sign in cancelled");
            } else {
                setError("Failed to sign in with Google. ensure your account is allowed.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await signIn(email, password);
            // Redirect will be handled by the useEffect above
        } catch (err: any) {
            console.error("Login error:", err);
            if (err.code === "auth/invalid-credential") {
                setError("Invalid email or password");
            } else if (err.code === "auth/user-not-found") {
                setError("No account found with this email");
            } else if (err.code === "auth/wrong-password") {
                setError("Incorrect password");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many failed attempts. Please try again later");
            } else {
                setError("Login failed. Please check your credentials");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Animated Background */}
            <Box
                sx={{
                    position: "absolute",
                    top: "20%",
                    left: "20%",
                    width: "300px",
                    height: "300px",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                    borderRadius: "50%",
                    animation: "pulse 3s ease-in-out infinite",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "20%",
                    right: "20%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)",
                    borderRadius: "50%",
                    animation: "pulse 4s ease-in-out infinite",
                }}
            />

            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                <Card
                    sx={{
                        p: 4,
                        background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 20px 60px 0 rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                    }}
                    className="fade-in"
                >
                    <CardContent>
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 1,
                                    fontWeight: 900,
                                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EF4444 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                                Enter the borderland and begin your quest
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<GoogleIcon />}
                            onClick={handleGoogleSignIn}
                            disabled={submitting}
                            sx={{
                                py: 1.5,
                                mb: 3,
                                fontSize: "1.05rem",
                                borderColor: "rgba(255,255,255,0.2)",
                                color: "white",
                                textTransform: "none",
                                background: "rgba(255,255,255,0.05)",
                                "&:hover": {
                                    borderColor: "rgba(255,255,255,0.4)",
                                    background: "rgba(255,255,255,0.1)",
                                }
                            }}
                        >
                            Sign in with VIT Email (Google)
                        </Button>

                        <Divider sx={{ mb: 3, "&::before, &::after": { borderColor: "rgba(255,255,255,0.1)" } }}>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                OR CONTINUE WITH EMAIL
                            </Typography>
                        </Divider>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="VIT Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                                placeholder="yourname@vit.ac.in"
                                helperText="Use your VIT email address"
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 4 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={submitting}
                                startIcon={<LoginIcon />}
                                sx={{
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                                    },
                                    "&:disabled": {
                                        background: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                {submitting ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>

                        <Box sx={{ mt: 3, textAlign: "center" }}>
                            <Button
                                variant="text"
                                onClick={() => router.push("/")}
                                sx={{ color: "text.secondary" }}
                            >
                                ← Back to Home
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Typography
                    variant="body2"
                    sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
                >
                    Only VIT email addresses (@vit.ac.in or @vitstudent.ac.in) are allowed
                </Typography>
            </Container>
        </Box>
    );
}