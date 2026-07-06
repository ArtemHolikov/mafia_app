import {
  Box,
  Button,
  Dialog,
  Divider,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  GoToAcquaintancePhase,
  NoPlayersMessage,
  PlayerItem,
  PlayerItemInfoText,
  PlayersBox,
  PlayersList,
  SettingsLobbyTitle,
  StartGameDialogBody,
} from "./index.styles";
import { useGameStore } from "../../store/gameStore";
import { NameTextField } from "./components/NameTextField";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface StartGameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const StartGameDialog = ({
  isOpen,
  setIsOpen,
}: StartGameDialogProps) => {
  const handleClose = (): void => {
    setIsOpen(false);
  };

  const players = useGameStore((state: any) => state.players);
  const setPlayers = useGameStore((state: any) => state.setPlayers);

  const setPhase = useGameStore((state: any) => state.setPhase);

  const navigate = useNavigate();

  const sortedPlayers = players.sort(
    (a: any, b: any) => a.tableOrder - b.tableOrder,
  );

  if (sortedPlayers && sortedPlayers.length > 0) {
    setPlayers(sortedPlayers);
  }

  const handleSwitchToAcquaintancePhase = () => {
    setPhase("acquaintance");
    handleClose();

    navigate("/acquaintance");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <StartGameDialogBody>
        <SettingsLobbyTitle>Lobby Settings</SettingsLobbyTitle>
        <Divider sx={{ width: "100%", height: "2px", background: "#1e1e1e" }} />
        <PlayersBox>
          <SettingsLobbyTitle>Players ({players.length})</SettingsLobbyTitle>
          <NameTextField />
          <PlayersList>
            {sortedPlayers.map((player: any) => (
              <PlayerItem>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginRight: "15px",
                    }}
                  >
                    <PlayerItemInfoText>{player.tableOrder}</PlayerItemInfoText>
                    <Divider
                      orientation="vertical"
                      sx={{
                        width: "1px",
                        height: "100%",
                        background: "#fff",
                      }}
                    />
                  </Box>
                  <PlayerItemInfoText>{player.nickname}</PlayerItemInfoText>
                </Box>
              </PlayerItem>
            ))}

            {sortedPlayers.length === 0 && (
              <NoPlayersMessage>No players currently</NoPlayersMessage>
            )}
          </PlayersList>
          <GoToAcquaintancePhase
            disabled={sortedPlayers.length === 0}
            onClick={handleSwitchToAcquaintancePhase}
          >
            Next
          </GoToAcquaintancePhase>
        </PlayersBox>
      </StartGameDialogBody>
    </Dialog>
  );
};
