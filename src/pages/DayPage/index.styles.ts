import { Box, styled } from "@mui/material";

export const FlickeringBox = styled(Box)(({ theme }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "100px",
  backgroundColor: "#08f700",
  animation: "pulse 1.5s infinite ease-in-out",

  "@keyframes pulse": {
    "0%": {
      opacity: 1,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.5,
      transform: "scale(0.98)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
}));

export const MafiaFlickeringBox = styled(Box)(({ theme }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "100px",
  backgroundColor: "#f23d3d",
  animation: "pulse-red 1.5s infinite ease-in-out",

  "@keyframes pulse-red": {
    "0%": {
      opacity: 1,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.5,
      transform: "scale(0.98)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
}));
