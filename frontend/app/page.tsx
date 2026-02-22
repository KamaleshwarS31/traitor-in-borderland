"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Shield,
  Dangerous,
  EmojiEvents,
  QrCode2,
  Timer,
  Groups,
} from "@mui/icons-material";

export default function Home() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user && userData) {
      // Redirect based on role
      if (userData.role === "master_admin") {
        router.push("/admin");
      } else if (userData.role === "team_lead") {
        router.push("/team-lead");
      } else if (userData.role === "member") {
        router.push("/member");
      }
    }
  }, [user, userData, loading, router]);

  if (loading || !mounted) {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Header Bar ── */}
      <Box
        component="header"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 5 },
          py: 1.5,
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 1200,
        }}
      >
        {/* Left – VIT Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/vit-logo.png"
            alt="VIT University"
            width={110}
            height={60}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Centre – Riviera 2026 Logo */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Image
            src="/riviera-logo.png"
            alt="Riviera 2026"
            width={200}
            height={70}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Right – Pepsi Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/pepsi-logo.png"
            alt="Pepsi – Official Sponsor"
            width={90}
            height={60}
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "pulse 5s ease-in-out infinite",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8, mt: 4 }} className="fade-in">
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 900,
              textShadow: "0 0 40px rgba(59, 130, 246, 0.5)",
            }}
          >
            Traitor in Borderland
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.5rem" },
            }}
          >
            A thrilling treasure hunt where innocents and traitors battle for gold.
            Will you trust your allies or suspect betrayal?
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/login")}
              sx={{
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                },
              }}
            >
              Enter the Game
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push("/spectator")}
              sx={{
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  background: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              Watch Live
            </Button>
          </Box>
        </Box>

        {/* Teams Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }} className="slide-in-left">
            <Card
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #1E3A8A 0%, #065F46 100%)",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Shield sx={{ fontSize: 48, color: "#3B82F6", mr: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    Innocents
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.8 }}>
                  Seek the golden treasures hidden across the borderland. Work together,
                  follow the clues, and collect as many gold bars as possible. But beware
                  - traitors lurk among you, ready to sabotage your efforts.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label="Treasure Hunters" sx={{ bgcolor: "rgba(59, 130, 246, 0.2)" }} />
                  <Chip label="Team Players" sx={{ bgcolor: "rgba(16, 185, 129, 0.2)" }} />
                  <Chip label="Clue Solvers" sx={{ bgcolor: "rgba(59, 130, 246, 0.2)" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="slide-in-right">
            <Card
              sx={{
                height: "100%",
                background: "linear-gradient(135deg, #991B1B 0%, #92400E 100%)",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Dangerous sx={{ fontSize: 48, color: "#EF4444", mr: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    Traitors
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.8 }}>
                  Hidden among the innocents, you possess the power to sabotage. Prevent
                  your enemies from scoring while collecting gold for yourself. Use your
                  abilities wisely - cooldowns and restrictions apply.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label="Saboteurs" sx={{ bgcolor: "rgba(239, 68, 68, 0.2)" }} />
                  <Chip label="Strategic" sx={{ bgcolor: "rgba(245, 158, 11, 0.2)" }} />
                  <Chip label="Deceptive" sx={{ bgcolor: "rgba(239, 68, 68, 0.2)" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Typography
          variant="h3"
          sx={{ textAlign: "center", mb: 4, fontWeight: 800 }}
          className="fade-in"
        >
          Game Features
        </Typography>
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {[
            {
              icon: <QrCode2 sx={{ fontSize: 40 }} />,
              title: "QR Code Scanning",
              description: "Scan QR codes to collect gold bars and reveal clues",
            },
            {
              icon: <Timer sx={{ fontSize: 40 }} />,
              title: "Timed Rounds",
              description: "4 exciting rounds with real-time countdown timers",
            },
            {
              icon: <EmojiEvents sx={{ fontSize: 40 }} />,
              title: "Live Leaderboard",
              description: "Watch rankings update in real-time as teams score",
            },
            {
              icon: <Groups sx={{ fontSize: 40 }} />,
              title: "Team Collaboration",
              description: "Work with 3 teammates to dominate the competition",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index} className="fade-in">
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 48px 0 rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 4,
            borderRadius: 4,
            background: "rgba(30, 41, 59, 0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          className="fade-in"
        >
          <Grid container spacing={4}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: "primary.main" }}>
                20
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Teams
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: "secondary.main" }}>
                80
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Players
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: "success.main" }}>
                4
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Rounds
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: "warning.main" }}>
                ∞
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Excitement
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* ── Footer Banner ── */}
      <Box
        sx={{
          width: "100%",
          mt: 8,
          display: "flex",
          justifyContent: "center",
          background: "rgba(15, 23, 42, 0.6)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          py: 2,
          px: 2,
        }}
      >
        <Image
          src="/footer-banner.png"
          alt="Footer banner"
          width={1200}
          height={140}
          style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
        />
      </Box>

      {/* ── Copyright Bar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          py: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap",
          px: 2,
        }}
      >
        {/* Health Club Logo – left of copyright */}
        <Image
          src="/healthclub-logo.png"
          alt="Health Club VIT"
          width={80}
          height={40}
          style={{ objectFit: "contain" }}
        />

        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
          © 2026 Health Club - VIT. All rights reserved.
        </Typography>

        {/* 40 Years VIT Logo – right of copyright */}
        <Image
          src="/vit-40years.png"
          alt="VIT 40 Years"
          width={80}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Box>
  );
}