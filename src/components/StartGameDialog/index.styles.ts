import {
  Box,
  Button,
  MenuItem,
  MenuList,
  styled,
  Typography,
} from "@mui/material";

export const StartGameDialogBody = styled(Box)({
  width: "min(92vw, 560px)",
  maxHeight: "85vh",
  overflow: "hidden",
  padding: "24px",
  background:
    "linear-gradient(145deg, rgba(17,24,39,0.98), rgba(10,14,26,0.98))",
});

export const SettingsLobbyTitle = styled(Typography)({
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "#f8fafc",
  padding: "4px 0 12px",
});

export const PlayersBox = styled(Box)({
  paddingTop: 8,
});

export const PlayersList = styled(MenuList)({
  marginTop: 16,
  overflowY: "auto",
  maxHeight: "360px",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const PlayerItem = styled(MenuItem)({
  borderRadius: 14,
  padding: "10px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
});

export const PlayerItemInfoText = styled(Typography)({
  color: "#f8fafc",
  fontWeight: 600,
  fontSize: "0.95rem",
});

export const NoPlayersMessage = styled(Typography)({
  fontSize: "1rem",
  color: "rgba(248,250,252,0.7)",
  textAlign: "center",
  padding: "24px 0",
});

export const GoToAcquaintancePhase = styled(Button)({
  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  color: "#fff",
  width: "100%",
  marginTop: 18,
  padding: "12px 16px",
});
