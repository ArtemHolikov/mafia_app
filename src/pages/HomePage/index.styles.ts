import { styled, Box, Button, Chip, Typography } from "@mui/material";

export const AppWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgimage",
})<{ bgimage?: string }>(({ bgimage }) => ({
  backgroundImage: `linear-gradient(110deg, rgba(2, 6, 23, 0.9), rgba(7, 24, 36, 0.76)), url(${bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  position: "relative",
  boxSizing: "border-box",
  "@supports (height: 100dvh)": {
    minHeight: "100dvh",
  },
  "@media (max-width: 600px)": {
    alignItems: "flex-start",
    padding: "calc(16px + env(safe-area-inset-top)) 12px calc(16px + env(safe-area-inset-bottom))",
  },
}));

export const HeroCard = styled(Box)({
  width: "min(100%, 700px)",
  padding: "clamp(24px, 5vw, 48px)",
  borderRadius: 20,
  background: "linear-gradient(145deg, rgba(11,25,38,0.92), rgba(5,13,24,0.9))",
  border: "1px solid rgba(103,232,249,0.2)",
  boxShadow:
    "0 28px 80px rgba(2,6,23,0.52), inset 0 1px rgba(255,255,255,0.07), 0 0 42px rgba(34,211,238,0.08)",
  backdropFilter: "blur(18px)",
  color: "#f8fafc",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "0 auto 0 0",
    width: 3,
    background: "linear-gradient(180deg, #67e8f9, #34d399)",
    boxShadow: "0 0 22px rgba(103,232,249,0.65)",
  },
  "@media (max-width: 600px)": {
    padding: "24px 20px",
    borderRadius: 16,
  },
});

export const HeroTitle = styled(Typography)({
  fontSize: "clamp(2rem, 4vw, 3rem)",
  fontWeight: 700,
  lineHeight: 1.1,
  marginTop: 12,
  marginBottom: 12,
});

export const HeroSubtitle = styled(Typography)({
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: "rgba(248, 250, 252, 0.8)",
  marginBottom: 24,
});

export const FeatureList = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 24,
});

export const FeatureChip = styled(Chip)({
  backgroundColor: "rgba(34, 211, 238, 0.08)",
  color: "#a5f3fc",
  border: "1px solid rgba(103, 232, 249, 0.2)",
  fontWeight: 600,
});

export const StartGameButton = styled(Button)({
  background: "linear-gradient(110deg, #06b6d4, #10b981)",
  color: "#04121b",
  fontSize: "1rem",
  padding: "13px 24px",
  minWidth: 180,
  borderRadius: 12,
  fontWeight: 800,
  boxShadow: "0 0 24px rgba(34,211,238,0.2)",
  "&:hover": {
    background: "linear-gradient(110deg, #22d3ee, #34d399)",
    boxShadow: "0 0 32px rgba(34,211,238,0.34)",
  },
  "@media (max-width: 400px)": {
    flex: 1,
    minWidth: 0,
    padding: "12px 14px",
  },
});

export const ResetGameButton = styled(Button)({
  color: "#f8fafc",
  fontSize: "1rem",
  padding: "13px 24px",
  minWidth: 180,
  borderRadius: 12,
  fontWeight: 700,
  border: "1px solid rgba(248,250,252,0.36)",
  "&:hover": {
    background: "rgba(248,250,252,0.1)",
    borderColor: "rgba(248,250,252,0.64)",
  },
  "@media (max-width: 400px)": {
    flex: 1,
    minWidth: 0,
    padding: "12px 14px",
  },
});
