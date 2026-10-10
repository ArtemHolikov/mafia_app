import { Box, Button, styled, TextField, Typography } from "@mui/material";

export const VotingDialogBody = styled(Box)({
  width: "100%",
  maxWidth: 420,
  boxSizing: "border-box",
  padding: "clamp(20px, 5vw, 28px)",
  background:
    "radial-gradient(ellipse at top left, rgba(8,145,178,0.16), transparent 52%), linear-gradient(145deg, #0e1b2a, #07111d)",
  border: "1px solid rgba(103,232,249,0.24)",
  boxShadow: "0 28px 80px rgba(2,6,23,0.75), 0 0 36px rgba(34,211,238,0.1)",
});

export const CountOfVotesField = styled(TextField)({
  width: "min(120px, 35vw)",
  textAlign: "center",
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    background: "rgba(4,14,25,0.72)",
    color: "#f8fafc",
    fontWeight: 750,
    "& fieldset": { borderColor: "rgba(103,232,249,0.26)" },
    "&:hover fieldset": { borderColor: "rgba(103,232,249,0.55)" },
    "&.Mui-focused fieldset": {
      borderColor: "#22d3ee",
      boxShadow: "0 0 0 3px rgba(34,211,238,0.1)",
    },
  },
});

export const CountOfVotesTitle = styled(Typography)({
  fontSize: "1rem",
  color: "#cffafe",
  fontWeight: 600,
});

export const SubmitButton = styled(Button)({
  width: "100%",
  marginTop: 20,
  color: "#04121b",
  fontSize: "1rem",
  fontWeight: 800,
  background: "linear-gradient(110deg, #06b6d4, #10b981)",
  padding: "13px 16px",
  borderRadius: 10,
  boxShadow: "0 0 20px rgba(34,211,238,0.18)",
  "&:hover": {
    background: "linear-gradient(110deg, #22d3ee, #34d399)",
    boxShadow: "0 0 28px rgba(34,211,238,0.3)",
  },
});
