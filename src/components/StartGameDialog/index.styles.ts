import { Box, MenuItem, MenuList, styled, Typography } from "@mui/material";

export const StartGameDialogBody = styled(Box)({
  background: "#3b3b3b",
  width: "500px",
  height: "750px",
  overflow: "hidden",
});

export const SettingsLobbyTitle = styled(Typography)({
  fontSize: "24px",
  lineHeight: "36px",
  fontFamily: "Calibre-R",
  fontWeight: 500,
  color: "#fff",
  padding: "15px 0",
  textAlign: "center",
});

export const PlayersBox = styled(Box)({
  padding: "0 10px 20px 10px",
});

export const PlayersList = styled(MenuList)({
  marginTop: "20px",
  overflowY: "auto",
  height: "430px",
  scrollbarColor: "#fff #757575" /* thumb color and track color */,
  scrollbarWidth: "thin" /* options: auto, thin, or none */,
  position: "relative",
});

export const PlayerItem = styled(MenuItem)({
  padding: 0,
  display: "flex",
  justifyContent: "space-between",
  height: "40px",
});

export const PlayerItemInfoText = styled(Typography)({
  color: "#fff",
  fontWeight: 500,
  fontFamily: "Calibre-R",
  fontSize: "18px",
  lineHeight: "32px",
});

export const NoPlayersMessage = styled(Typography)({
  fontSize: "24px",
  lineHeight: "36px",
  fontFamily: "Calibre-R",
  fontWeight: 500,
  color: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});
