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
  transition: "all .3s ease",
  userSelect: "none",
  position: "relative",

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    cursor: "pointer",
  },

  "&:active": {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});

export const OrderNicknameText = styled(Typography)({
  fontSize: "18px",
  lineHeight: "32px",
  fontFamily: "Calibre-R",
  zIndex: 999,
});

export const RoleText = styled(Typography)({
  fontSize: "20px",
  lineHeight: "36px",
  fontFamily: "Calibre-R",
  fontWeight: 600,
  zIndex: 999,
});

export const RaisedForVotingBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: -2,
  opacity: 0.4,
});
