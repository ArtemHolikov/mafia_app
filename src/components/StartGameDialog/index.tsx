import { Box, Dialog, Divider, Typography } from "@mui/material";
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

  const setPhase = useGameStore((state: any) => state.setPhase);

  const navigate = useNavigate();

  const sortedPlayers = [...players].sort(
    (a: any, b: any) => a.tableOrder - b.tableOrder,
  );

  const handleSwitchToAcquaintancePhase = () => {
    setPhase("night acquaintance");
    handleClose();

    navigate("/acquaintance");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <StartGameDialogBody>
        <SettingsLobbyTitle>Lobby setup</SettingsLobbyTitle>
        <Typography sx={{ color: "rgba(248,250,252,0.75)", mb: 2 }}>
          Add players, assign their table order, and launch the game flow.
        </Typography>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <PlayersBox>
          <SettingsLobbyTitle>Players ({players.length})</SettingsLobbyTitle>
          <NameTextField />
          <PlayersList>
            {sortedPlayers.map((player: any) => (
              <PlayerItem key={player.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PlayerItemInfoText>#{player.tableOrder}</PlayerItemInfoText>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "rgba(255,255,255,0.14)" }}
                  />
                  <PlayerItemInfoText>{player.nickname}</PlayerItemInfoText>
                </Box>
              </PlayerItem>
            ))}

            {sortedPlayers.length === 0 && (
              <NoPlayersMessage>No players yet</NoPlayersMessage>
            )}
          </PlayersList>
          <GoToAcquaintancePhase
            disabled={sortedPlayers.length === 0}
            onClick={handleSwitchToAcquaintancePhase}
          >
            Start acquaintance
          </GoToAcquaintancePhase>
        </PlayersBox>
      </StartGameDialogBody>
    </Dialog>
  );
};
