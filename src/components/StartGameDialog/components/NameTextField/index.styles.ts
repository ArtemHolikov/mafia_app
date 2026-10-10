import { Button, styled, TextField } from "@mui/material";

export const PlayersTextField = styled(TextField)({
  flex: 1,
  minWidth: 0,
  flexDirection: "row",
  width: "100%",

  "& .MuiInputBase-root": {
    width: "100%",
  },
});

export const PlayerOrderField = styled(TextField)({
  width: "min(84px, 24vw)",
});

export const AddPlayerButton = styled(Button)({
  background: "linear-gradient(110deg, #06b6d4, #10b981)",
  color: "#04121b",
  minWidth: 72,
  padding: "12px 16px",
  borderRadius: 10,
  fontWeight: 800,
  boxShadow: "0 0 18px rgba(34,211,238,0.16)",
  "&:hover": {
    background: "linear-gradient(110deg, #22d3ee, #34d399)",
    boxShadow: "0 0 24px rgba(34,211,238,0.28)",
  },
});
