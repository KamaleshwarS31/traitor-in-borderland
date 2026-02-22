"use client";

import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/theme/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function ClientShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <SocketProvider>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        }}
                    >
                        <SiteHeader />
                        <Box component="main" sx={{ flex: 1 }}>
                            {children}
                        </Box>
                        <SiteFooter />
                    </Box>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
