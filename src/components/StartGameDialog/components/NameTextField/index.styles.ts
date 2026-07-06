import { Button, styled, TextField } from "@mui/material";

export const PlayersTextField = styled(TextField)({
  width: "75%",
  fontSize: "18px",
  background: "#9e9e9e",
  fontFamily: "Calibre-R",

  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    borderRadius: 0,

    "&.Mui-focused fieldset": {
      borderColor: "#4F4F4F",
      borderWidth: "2px",
    },
  },
});

export const PlayerOrderField = styled(TextField)({
  width: "15%",
  fontSize: "18px",
  background: "#9e9e9e",
  fontFamily: "Calibre-R",

  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    borderRadius: 0,

    "&.Mui-focused fieldset": {
      borderColor: "#4F4F4F",
      borderWidth: "2px",
    },
  },
});

export const AddPlayerButton = styled(Button)({
  background: "#48e400",
  color: "#000",
  fontWeight: 600,
  fontSize: "14px",
  textTransform: "capitalize",
  fontFamily: "Calibre-R",
  padding: "16px",

  "&:disabled": {
    background: "#3aac06",
  },
});
