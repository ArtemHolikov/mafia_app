import {
  Box,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { ActionButton, DialogBody } from "../PlayerActionsModal/index.styles";
import { SettingPlayerInfoTitle } from "../../pages/AcquaintancePage/components/AcquaintancePlayerModal/index.styles";
import {
  CountOfVotesField,
  CountOfVotesTitle,
  SubmitButton,
} from "./index.styles";
import { useGameStore } from "../../store/gameStore";
import { useState } from "react";

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

  const handleChangeCountOfVotes = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCountOfVotes(Number(e.target.value));
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
        <Divider sx={{ width: "100%", height: "2px", background: "#1e1e1e" }} />
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <CountOfVotesTitle>Count of votes:</CountOfVotesTitle>
          <CountOfVotesField
            onChange={(e) => handleChangeCountOfVotes(e)}
            type="number"
            slotProps={{
              input: {
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
        <SubmitButton onClick={handleSubmitReceivedVotes}>Submit</SubmitButton>
      </DialogBody>
    </Dialog>
  );
};
