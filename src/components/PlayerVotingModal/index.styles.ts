import { Button, styled, TextField, Typography } from "@mui/material";

export const CountOfVotesField = styled(TextField)({
  width: "25%",
  textAlign: "center",
  background: "#5a5a5a",
  color: "#fff",
});

export const CountOfVotesTitle = styled(Typography)({
  fontSize: "20px",
  lineHeight: "32px",
  fontFamily: "Calibre-R",
  color: "#fff",
  fontWeight: 500,
});

export const SubmitButton = styled(Button)({
  width: "268px",
  position: "absolute",
  bottom: 0,
  marginBottom: "15px",
  marginLeft: "16px",
  color: "#fff",
  fontSize: "20px",
  lineHeight: "32px",
  fontFamily: "Calibre-R",
  textTransform: "capitalize",
  fontWeight: 500,
  background: "#178102",
});
