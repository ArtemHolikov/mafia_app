import { Button, styled, TextField } from "@mui/material";

export const PlayersTextField = styled(TextField)({
  flex: 1,
  minWidth: 200,
});

export const PlayerOrderField = styled(TextField)({
  width: 84,
});

export const AddPlayerButton = styled(Button)({
  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  color: "#fff",
  minWidth: 92,
  padding: "12px 16px",
});
