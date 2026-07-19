import { Avatar, Box, Card, Typography } from "@mui/material";

import {
  CardWrapper,
  OrderNicknameText,
  RaisedForVotingBox,
  RoleText,
  MarkIconBox,
} from "./index.styles";
import { imageToDisplay } from "../../../../constants";
import { useState } from "react";
import { AcquaintancePlayerModal } from "../AcquaintancePlayerModal";
import { useGameStore } from "../../../../store/gameStore";
import { PlayerActionsModal } from "../../../../components/PlayerActionsModal";

import RaisedForVoting from "../../../../images/raisedForVoting.png";
import MafiaMark from "../../../../images/mafia_mark.png";
import ManiacMark from "../../../../images/maniac_mark.png";
import ThiefMark from "../../../../images/thief_mark.png";
import DoubleKill from "../../../../images/double_kill.png";
import { PlayerVotingModal } from "../../../../components/PlayerVotingModal";

interface PlayerCardProps {
  id: number;
  nickname: string;
  tableOrder: number;
  role: string;
  voteModeVoterId?: number | null;
  onStartVoteMode?: (voterId: number | null) => void;
  onVoteTargetSelect?: (targetId: number) => void;
  nightAction?: "mafia" | "maniac" | "doctor" | "thief" | null;
  onNightTargetSelect?: (targetId: number) => void;
}

export const PlayerCard = ({
  id,
  nickname,
  tableOrder,
  role,
  onVoteTargetSelect,
  onStartVoteMode,
  voteModeVoterId,
  nightAction,
  onNightTargetSelect,
}: PlayerCardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const phase = useGameStore((state: any) => state.phase);
  const players = useGameStore((state: any) => state.players);
  const votingEntries = useGameStore((state: any) => state.votingEntries);

  const isPlayerRaisedForVoting = players.find(
    (player: any) => player.id === id && player.raisedForVoting,
  );
  const playerRecord = players.find((player: any) => player.id === id);
  const isImmune = Boolean(
    playerRecord?.immunityNights && playerRecord.immunityNights > 0,
  );
  const isDisabledByImmunity =
    nightAction === "mafia" || nightAction === "maniac" ? isImmune : false;
  const currentVotes =
    phase === "voting"
      ? (votingEntries?.[id] ?? playerRecord?.votesReceived)
      : 0;

  const handleClickPlayerCard = () => {
    if (voteModeVoterId !== null && voteModeVoterId !== undefined) {
      onVoteTargetSelect?.(id);
      return;
    }

    if (nightAction) {
      if (isDisabledByImmunity) {
        return;
      }
      onNightTargetSelect?.(id);
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
          opacity: isDisabledByImmunity ? 0.55 : 1,
        }}
      >
        <Box>
          <OrderNicknameText>
            {tableOrder} | {nickname}
          </OrderNicknameText>
          <RoleText>{role}</RoleText>
          {currentVotes > 0 && (
            <Typography sx={{ fontSize: "0.85rem", color: "#f8fafc", mt: 1 }}>
              Votes: {currentVotes}
            </Typography>
          )}
        </Box>
        <img src={imageToDisplay[role.toLowerCase()]} width={85} height={85} />
        {playerRecord?.pendingMafiaKill && playerRecord?.pendingManiacKill ? (
          <MarkIconBox>
            <img src={DoubleKill} width={200} height={150} />
          </MarkIconBox>
        ) : (
          <>
            {playerRecord?.pendingMafiaKill && (
              <MarkIconBox>
                <img src={MafiaMark} width={200} height={150} />
              </MarkIconBox>
            )}
            {playerRecord?.pendingManiacKill && (
              <MarkIconBox>
                <img src={ManiacMark} width={200} height={150} />
              </MarkIconBox>
            )}
          </>
        )}
        {playerRecord?.pendingThiefBlock && (
          <MarkIconBox>
            <img src={ThiefMark} width={200} height={150} />
          </MarkIconBox>
        )}
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

      {phase === "voting" && openModal && (
        <PlayerVotingModal
          open={openModal}
          setOpen={setOpenModal}
          id={id}
          nickname={nickname}
        />
      )}
    </>
  );
};
