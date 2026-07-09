import { Box, Button, styled } from "@mui/material";

export const DialogBody = styled(Box)({
  width: "min(92vw, 360px)",
  padding: "24px",
  background:
    "linear-gradient(145deg, rgba(17,24,39,0.97), rgba(10,14,26,0.98))",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 25px 60px rgba(2, 6, 23, 0.45)",
});

export const ActionButton = styled(Button)({
  fontSize: "1rem",
  lineHeight: 1.5,
  fontWeight: 600,
  color: "#f8fafc",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  justifyContent: "flex-start",
  padding: "14px 16px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.06)",
  textTransform: "none",
  border: "1px solid rgba(255,255,255,0.08)",
  marginBottom: 12,
  transition: "transform 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    background: "rgba(139, 92, 246, 0.16)",
    transform: "translateY(-1px)",
  },
});
