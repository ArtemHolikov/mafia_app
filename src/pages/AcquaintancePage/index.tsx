import { Box, Button } from "@mui/material";
import { useState } from "react";
import {
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionTitle,
} from "./index.styles";

import backgroundImage from "../../images/backgroundPhoto.png";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "./components/PlayerCard";

export const AcquaintancePage = () => {
  const players = useGameStore((state: any) => state.players);
  const phase = useGameStore((state: any) => state.phase);
  const setPhase = useGameStore((state: any) => state.setPhase);
  const raisedForVoting = useGameStore((state: any) => state.raisedForVoting);
  const [voteModeVoterId, setVoteModeVoterId] = useState<number | null>(null);

  const switchToDayAcquaintance = () => {
    setPhase("day acquaintance");
  };

  const handleVoteTargetSelect = (targetId: number) => {
    if (voteModeVoterId === null) return;
    raisedForVoting(targetId);
    setVoteModeVoterId(null);
  };

  return (
    <PageWrapper {...{ bgimage: backgroundImage }}>
      <SectionTitle>{phase.toUpperCase()}</SectionTitle>
      <PlayerCardsWrapper>
        {players.map((player: any) => (
          <PlayerCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            role={player.role}
            tableOrder={player.tableOrder}
            voteModeVoterId={voteModeVoterId}
            onStartVoteMode={setVoteModeVoterId}
            onVoteTargetSelect={handleVoteTargetSelect}
          />
        ))}
      </PlayerCardsWrapper>
      <GoToDayAcquaintanceButton onClick={switchToDayAcquaintance}>
        Go To Day Acquaintance
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
