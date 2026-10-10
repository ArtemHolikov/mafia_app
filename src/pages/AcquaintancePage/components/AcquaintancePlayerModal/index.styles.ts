import { Box, Button, Select, styled, Typography } from "@mui/material";

export const DialogBody = styled(Box)({
  width: "100%",
  maxWidth: 620,
  boxSizing: "border-box",
  padding: "clamp(18px, 4vw, 28px)",
  background:
    "radial-gradient(ellipse at top left, rgba(8,145,178,0.16), transparent 52%), linear-gradient(145deg, #0e1b2a, #07111d)",
  border: "1px solid rgba(103,232,249,0.24)",
  boxShadow: "0 28px 80px rgba(2,6,23,0.75), 0 0 36px rgba(34,211,238,0.1)",
});

export const SettingPlayerInfoTitle = styled(Typography)({
  fontSize: "1.3rem",
  fontWeight: 700,
  color: "#cffafe",
  textAlign: "center",
  marginBottom: 8,
  textShadow: "0 0 18px rgba(34,211,238,0.2)",
});

export const PlayerInfoWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "16px",
  borderRadius: 12,
  background: "linear-gradient(135deg, rgba(8,47,60,0.44), rgba(4,14,25,0.72))",
  border: "1px solid rgba(103,232,249,0.16)",
  boxShadow: "inset 0 1px rgba(255,255,255,0.035)",
  "@media (max-width: 480px)": {
    alignItems: "flex-start",
    flexDirection: "column",
    padding: 12,
    gap: 8,
  },
});

export const PlayerInfoText = styled(Typography)({
  fontSize: "0.96rem",
  lineHeight: 1.6,
  fontWeight: 600,
  color: "#f8fafc",
});

export const SelectRoleWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 0",
  "@media (max-width: 480px)": {
    alignItems: "stretch",
    flexDirection: "column",
  },
});

export const SelectRole = styled(Select)({
  minWidth: 0,
  width: "100%",
  borderRadius: 16,
  background: "rgba(255,255,255,0.08)",
  color: "#f8fafc",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.16)",
  },
});

export const ConfirmButton = styled(Button)({
  background: "linear-gradient(110deg, #06b6d4, #10b981)",
  width: "100%",
  color: "#04121b",
  fontWeight: 700,
  fontSize: "1rem",
  padding: "12px 16px",
  borderRadius: 10,
  boxShadow: "0 0 20px rgba(34,211,238,0.18)",
  "&:hover": {
    background: "linear-gradient(110deg, #22d3ee, #34d399)",
    boxShadow: "0 0 28px rgba(34,211,238,0.3)",
  },
});

export const ConfirmButtonBox = styled(Box)({
  paddingTop: 16,
});
