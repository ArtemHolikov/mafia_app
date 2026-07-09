import { Box, Button, Select, styled, Typography } from "@mui/material";

export const DialogBody = styled(Box)({
  width: "min(92vw, 560px)",
  padding: "24px",
  background:
    "linear-gradient(145deg, rgba(17,24,39,0.97), rgba(10,14,26,0.98))",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 25px 60px rgba(2, 6, 23, 0.45)",
});

export const SettingPlayerInfoTitle = styled(Typography)({
  fontSize: "1.3rem",
  fontWeight: 700,
  color: "#f8fafc",
  textAlign: "center",
  marginBottom: 8,
});

export const PlayerInfoWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "16px 0 20px",
  borderRadius: 18,
  background: "rgba(255,255,255,0.05)",
  paddingLeft: 16,
  paddingRight: 16,
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
});

export const SelectRole = styled(Select)({
  minWidth: 200,
  borderRadius: 16,
  background: "rgba(255,255,255,0.08)",
  color: "#f8fafc",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.16)",
  },
});

export const ConfirmButton = styled(Button)({
  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  width: "100%",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  padding: "12px 16px",
  borderRadius: 16,
});

export const ConfirmButtonBox = styled(Box)({
  paddingTop: 16,
});
