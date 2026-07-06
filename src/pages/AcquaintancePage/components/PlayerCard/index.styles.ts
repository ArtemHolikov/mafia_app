import { Box, styled } from "@mui/material";

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
