import { Box, Dialog, Divider, Typography } from "@mui/material";
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
        <Typography
          sx={{ color: "rgba(248,250,252,0.75)", textAlign: "center", mb: 2 }}
        >
          Choose an action for this player.
        </Typography>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <Box sx={{ paddingTop: 2 }}>
          <ActionButton onClick={handleAddFoul}>
            <img src={Foul} width={32} height={32} alt="foul" />
            <span>
              Add foul{" "}
              {currentPlayer?.fouls > 0 ? `(${currentPlayer.fouls})` : ""}
            </span>
          </ActionButton>
          <ActionButton onClick={handleVoteForPlayer}>
            <img src={Voting} width={32} height={32} alt="vote" />
            <span>Nominate for voting</span>
          </ActionButton>
        </Box>
      </DialogBody>
    </Dialog>
  );
};
