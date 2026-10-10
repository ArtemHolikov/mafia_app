import { styled, Box, Button, Typography } from "@mui/material";

export const PageWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgimage",
})<{ bgimage?: string }>(({ bgimage }) => ({
  backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.84)), url(${bgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  width: "100%",
  padding: "24px 24px calc(96px + env(safe-area-inset-bottom))",
  overflow: "auto",
  position: "relative",
  "@supports (height: 100dvh)": {
    minHeight: "100dvh",
  },
  "@media (max-width: 600px)": {
    padding: "16px 12px calc(190px + env(safe-area-inset-bottom))",
  },
}));

export const ContentShell = styled(Box)({
  maxWidth: "1400px",
  margin: "0 auto",
});

export const TopBar = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "16px 0 28px",
  flexWrap: "wrap",
  "@media (max-width: 600px)": {
    alignItems: "stretch",
    gap: 12,
    padding: "8px 0 18px",
    "& > *": {
      minWidth: 0,
      maxWidth: "100%",
    },
  },
});

export const PlayerCardsWrapper = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  marginTop: 8,
  "@media (max-width: 600px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 12,
  },
});

export const SectionTitle = styled(Typography)({
  fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
  fontWeight: 700,
  color: "#fff",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
});

export const SectionChip = styled(Box)({
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(11, 184, 171, 0.14)",
  color: "#99f6e4",
  fontSize: "0.95rem",
  fontWeight: 600,
  border: "1px solid rgba(45, 211, 195, 0.24)",
});

export const GoToDayAcquaintanceButton = styled(Button)({
  position: "fixed",
  bottom: 20,
  right: 20,
  padding: "12px 20px",
  background: "#0bb8ab",
  color: "#04121b",
  borderRadius: 999,
  boxShadow: "0 0 24px rgba(11,184,171,0.28)",
  zIndex: 20,
  "&:hover": {
    background: "#2bd3c3",
    boxShadow: "0 0 30px rgba(45,211,195,0.38)",
  },
  "@media (max-width: 600px)": {
    left: 12,
    right: 12,
    bottom: "calc(12px + env(safe-area-inset-bottom))",
    width: "auto",
    padding: "12px 16px",
    minHeight: 48,
  },
});

export const NightActionsWrapper = styled(Box)({
  position: "fixed",
  bottom: 20,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  gap: 12,
  padding: "0 24px",
  zIndex: 10,
  "@media (max-width: 600px)": {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    bottom: "calc(72px + env(safe-area-inset-bottom))",
    gap: 8,
    padding: "0 12px",
    "& > *": {
      width: "100%",
      minWidth: "0 !important",
      padding: "10px 8px",
      fontSize: "0.82rem",
      lineHeight: 1.2,
      whiteSpace: "normal",
      minHeight: 42,
    },
  },
});

export const NightActionButton = styled(Button)({
  padding: "12px 18px",
  minWidth: 160,
  borderRadius: 999,
  background: "rgba(59, 130, 246, 0.92)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 10px 24px rgba(59, 130, 246, 0.2)",
  "&:disabled": {
    background: "rgba(148, 163, 184, 0.6)",
    color: "rgba(255,255,255,0.8)",
  },
});
