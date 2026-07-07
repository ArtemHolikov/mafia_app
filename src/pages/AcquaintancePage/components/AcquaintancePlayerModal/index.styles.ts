import { Box, Button, Select, styled, Typography } from "@mui/material";

export const DialogBody = styled(Box)({
  background: "#3b3b3b",
  width: "500px",
  height: "450px",
  overflow: "hidden",
  position: "relative",
});

export const SettingPlayerInfoTitle = styled(Typography)({
  fontSize: "24px",
  lineHeight: "36px",
  fontFamily: "Calibre-R",
  fontWeight: 500,
  color: "#fff",
  padding: "15px 0",
  textAlign: "center",
});

export const PlayerInfoWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const PlayerInfoText = styled(Typography)({
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: 600,
  color: "#fff",
});

export const SelectRoleWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const SelectRole = styled(Select)({
  background: "#fff",
});

export const ConfirmButton = styled(Button)({
  background: "#1d8f00",
  width: "100%",
  color: "#000",
  textTransform: "capitalize",
  fontWeight: 600,
  fontSize: "18px",
  fontFamily: "Calibre-R",
});

export const ConfirmButtonBox = styled(Box)({
  padding: "16px",
  position: "absolute",
  bottom: 0,
  width: "470px",
});
