import { Avatar, Box, Card, Typography } from "@mui/material";

import {
  CardWrapper,
  OrderNicknameText,
  RaisedForVotingBox,
  RoleText,
} from "./index.styles";
import { imageToDisplay } from "../../../../constants";
import { useState } from "react";
import { AcquaintancePlayerModal } from "../AcquaintancePlayerModal";
import { useGameStore } from "../../../../store/gameStore";
import { PlayerActionsModal } from "../../../../components/PlayerActionsModal";

import RaisedForVoting from "../../../../images/raisedForVoting.png";

interface PlayerCardProps {
  id: number;
  nickname: string;
  tableOrder: number;
  role: string;
  voteModeVoterId: number | null;
  onStartVoteMode: (voterId: number | null) => void;
  onVoteTargetSelect: (targetId: number) => void;
}

export const PlayerCard = ({
  id,
  nickname,
  tableOrder,
  role,
  onVoteTargetSelect,
  onStartVoteMode,
  voteModeVoterId,
}: PlayerCardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const phase = useGameStore((state: any) => state.phase);
  const players = useGameStore((state: any) => state.players);

  const isPlayerRaisedForVoting = players.find(
    (player: any) => player.id === id && player.raisedForVoting,
  );

  const handleClickPlayerCard = () => {
    if (voteModeVoterId !== null) {
      onVoteTargetSelect(id);
      return;
    }

    setOpenModal(true);
  };

  return (
    <>
      <CardWrapper
        onClick={handleClickPlayerCard}
        sx={{
          background: isPlayerRaisedForVoting ? "#beb243" : "",
        }}
      >
        <Box>
          <OrderNicknameText>
            {tableOrder} | {nickname}
          </OrderNicknameText>
          <RoleText>{role}</RoleText>
        </Box>
        <img src={imageToDisplay[role.toLowerCase()]} width={85} height={85} />
        {isPlayerRaisedForVoting && (
          <RaisedForVotingBox>
            <img src={RaisedForVoting} width={200} height={150} />
          </RaisedForVotingBox>
        )}
      </CardWrapper>

      {phase === "night acquaintance" && openModal && (
        <AcquaintancePlayerModal
          id={id}
          nickname={nickname}
          open={openModal}
          setOpen={setOpenModal}
          role={role}
        />
      )}

      {phase === "day acquaintance" && openModal && (
        <PlayerActionsModal
          open={openModal}
          setOpen={setOpenModal}
          id={id}
          nickname={nickname}
          onVoteModeStart={onStartVoteMode}
        />
      )}
    </>
  );
};
