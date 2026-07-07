import { Box, Button, Dialog, Divider } from "@mui/material";
import { ActionButton, DialogBody } from "./index.styles";
import { SettingPlayerInfoTitle } from "../../pages/AcquaintancePage/components/AcquaintancePlayerModal/index.styles";
import { useGameStore } from "../../store/gameStore";

import Foul from "../../images/foul.png";
import Voting from "../../images/voting.png";

interface PlayerActionsModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
  nickname: string;
  onVoteModeStart?: (voterId: number) => void;
}

export const PlayerActionsModal = ({
  open,
  setOpen,
  id,
  nickname,
  onVoteModeStart,
}: PlayerActionsModal) => {
  const handleClose = () => {
    setOpen(false);
  };

  const players = useGameStore((state: any) => state.players);
  const addFoul = useGameStore((state: any) => state.addFoul);

  const currentPlayer = players.find((player: any) => player.id === id);

  const handleAddFoul = () => {
    addFoul(id);

    handleClose();
  };

  const handleVoteForPlayer = () => {
    handleClose();
    onVoteModeStart?.(id);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogBody>
        <SettingPlayerInfoTitle>
          {id} | {nickname}
        </SettingPlayerInfoTitle>
        <Divider sx={{ width: "100%", height: "2px", background: "#1e1e1e" }} />
        <Box sx={{ padding: "16px" }}>
          <Box>
            <ActionButton onClick={handleAddFoul}>
              <img src={Foul} width={45} height={45} />
              Add foul{" "}
              {currentPlayer.fouls > 0 ? `(${currentPlayer.fouls})` : ""}
            </ActionButton>
          </Box>
          <Box>
            <ActionButton onClick={handleVoteForPlayer}>
              <img src={Voting} width={45} height={45} />
              Voting for player
            </ActionButton>
          </Box>
        </Box>
      </DialogBody>
    </Dialog>
  );
};
