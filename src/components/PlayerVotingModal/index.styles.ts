import { Button, styled, TextField, Typography } from "@mui/material";

export const CountOfVotesField = styled(TextField)({
  width: "110px",
  textAlign: "center",
  "& .MuiOutlinedInput-root": {
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    color: "#f8fafc",
  },
});

export const CountOfVotesTitle = styled(Typography)({
  fontSize: "1rem",
  color: "#f8fafc",
  fontWeight: 600,
});

export const SubmitButton = styled(Button)({
  width: "100%",
  marginTop: 18,
  color: "#fff",
  fontSize: "1rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  padding: "12px 16px",
  borderRadius: 16,
});
