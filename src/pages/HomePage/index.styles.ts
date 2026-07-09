import { styled, Box, Button, Chip, Typography } from "@mui/material";

export const AppWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgimage",
})<{ bgimage?: string }>(({ bgimage }) => ({
  backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.9), rgba(15, 23, 42, 0.75)), url(${bgimage})`,
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
}));

export const HeroCard = styled(Box)({
  width: "min(100%, 640px)",
  padding: "40px",
  borderRadius: 28,
  background: "rgba(15, 23, 42, 0.78)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 24px 70px rgba(2, 6, 23, 0.38)",
  backdropFilter: "blur(16px)",
  color: "#f8fafc",
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
  backgroundColor: "rgba(139, 92, 246, 0.16)",
  color: "#e9d5ff",
  border: "1px solid rgba(167, 139, 250, 0.24)",
  fontWeight: 600,
});

export const StartGameButton = styled(Button)({
  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  color: "#fff",
  fontSize: "1rem",
  padding: "12px 22px",
  minWidth: 180,
});
