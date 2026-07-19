import { Box, styled, Typography } from "@mui/material";

export const CardWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  minHeight: 142,
  padding: "24px",
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 16px 40px rgba(2, 6, 23, 0.22)",
  backdropFilter: "blur(10px)",
  color: "#f8fafc",
  transition: "transform 0.2s ease, background-color 0.2s ease",
  userSelect: "none",
  position: "relative",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-2px)",
    background: "rgba(255, 255, 255, 0.16)",
  },
});

export const OrderNicknameText = styled(Typography)({
  fontSize: "1rem",
  lineHeight: 1.5,
  fontWeight: 600,
  zIndex: 1,
});

export const RoleText = styled(Typography)({
  fontSize: "0.95rem",
  lineHeight: 1.5,
  color: "rgba(248, 250, 252, 0.74)",
  fontWeight: 500,
  zIndex: 1,
  marginTop: 4,
});

export const RaisedForVotingBox = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255, 255, 255, 0.06)",
  borderRadius: 22,
  opacity: 0.82,
  zIndex: 0,
});

export const MarkIconBox = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(231, 80, 80, 0.66)",
  borderRadius: 22,
  opacity: 0.82,
  zIndex: 0,
});
