import { Box, styled, Typography } from "@mui/material";

export const CardWrapper = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 80,
  width: "300px",
  padding: "40px 20px",
  borderRadius: 12,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(4px)",
  color: "#111",
  marginBottom: 12,
});

export const OrderNicknameText = styled(Typography)({
  fontSize: "18px",
  lineHeight: "32px",
  fontFamily: "Calibre-R",
});

export const RoleText = styled(Typography)({
  fontSize: "20px",
  lineHeight: "36px",
  fontFamily: "Calibre-R",
  fontWeight: 600,
});
