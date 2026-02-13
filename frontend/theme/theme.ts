import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#3B82F6", // Innocent Blue
            light: "#60A5FA",
            dark: "#2563EB",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#EF4444", // Traitor Red
            light: "#F87171",
            dark: "#DC2626",
            contrastText: "#FFFFFF",
        },
        success: {
            main: "#10B981",
            light: "#34D399",
            dark: "#059669",
        },
        warning: {
            main: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706",
        },
        error: {
            main: "#EF4444",
            light: "#F87171",
            dark: "#DC2626",
        },
        background: {
            default: "#0F172A",
            paper: "#1E293B",
        },
        text: {
            primary: "#F1F5F9",
            secondary: "#CBD5E1",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: "3.5rem",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EF4444 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
        },
        h2: {
            fontWeight: 700,
            fontSize: "2.5rem",
            letterSpacing: "-0.01em",
        },
        h3: {
            fontWeight: 700,
            fontSize: "2rem",
        },
        h4: {
            fontWeight: 600,
            fontSize: "1.5rem",
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.25rem",
        },
        h6: {
            fontWeight: 600,
            fontSize: "1rem",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: "12px 24px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.4)",
                    },
                },
                contained: {
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    backdropFilter: "blur(4px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 48px 0 rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    borderRadius: 16,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 12,
                        background: "rgba(255, 255, 255, 0.05)",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.08)",
                        },
                        "&.Mui-focused": {
                            background: "rgba(255, 255, 255, 0.1)",
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;