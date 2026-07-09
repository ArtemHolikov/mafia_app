import { Box, Dialog, Divider, Typography } from "@mui/material";
import { DialogBody } from "../PlayerActionsModal/index.styles";
import { SettingPlayerInfoTitle } from "../../pages/AcquaintancePage/components/AcquaintancePlayerModal/index.styles";
import {
  CountOfVotesField,
  CountOfVotesTitle,
  SubmitButton,
} from "./index.styles";
import { useGameStore } from "../../store/gameStore";
import { useEffect, useState } from "react";

interface PlayerVotingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
  nickname: string;
}

export const PlayerVotingModal = ({
  open,
  setOpen,
  id,
  nickname,
}: PlayerVotingModalProps) => {
  const [countOfVotes, setCountOfVotes] = useState(0);

  const submitReceivedVotes = useGameStore(
    (state: any) => state.submitReceivedVotes,
  );

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setCountOfVotes(0);
    }
  }, [open]);

  const handleChangeCountOfVotes = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = Number(e.target.value);
    setCountOfVotes(Number.isNaN(value) ? 0 : Math.max(0, value));
  };

  const handleSubmitReceivedVotes = () => {
    submitReceivedVotes(id, countOfVotes);
    handleClose();
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
          Enter how many votes this player received.
        </Typography>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <Box
          sx={{
            paddingTop: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <CountOfVotesTitle>Votes received</CountOfVotesTitle>
          <CountOfVotesField
            value={countOfVotes}
            onChange={(e) => handleChangeCountOfVotes(e)}
            type="number"
            slotProps={{
              input: {
                inputProps: { min: 0 },
                sx: {
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                },
              },
            }}
          />
        </Box>
        <SubmitButton onClick={handleSubmitReceivedVotes}>
          Save votes
        </SubmitButton>
      </DialogBody>
    </Dialog>
  );
};
