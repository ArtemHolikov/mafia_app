import { Box, Button, styled } from "@mui/material";

export const DialogBody = styled(Box)({
  background: "#3b3b3b",
  width: "300px",
  height: "250px",
  overflow: "hidden",
});

export const ActionButton = styled(Button)({
  fontSize: "20px",
  fontFamily: "Calibre-R",
  lineHeight: "32px",
  fontWeight: 600,
  color: "#FFF",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  justifyContent: "center",
  textTransform: "capitalize",
});
