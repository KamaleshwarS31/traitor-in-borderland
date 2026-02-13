"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("master_admin" | "team_lead" | "member")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { user, userData, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
                // Redirect to appropriate page based on role
                if (userData.role === "master_admin") {
                    router.push("/admin");
                } else if (userData.role === "team_lead") {
                    router.push("/team-lead");
                } else {
                    router.push("/member");
                }
            }
        }
    }, [user, userData, loading, router, allowedRoles]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!user || (allowedRoles && userData && !allowedRoles.includes(userData.role))) {
        return null;
    }

    return <>{children}</>;
}
