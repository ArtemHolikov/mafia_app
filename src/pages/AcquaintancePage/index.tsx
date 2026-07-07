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
import { useNavigate } from "react-router-dom";

export const AcquaintancePage = () => {
  const navigate = useNavigate();
  const players = useGameStore((state: any) => state.players);
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );
  const phase = useGameStore((state: any) => state.phase);
  const setPhase = useGameStore((state: any) => state.setPhase);
  const raisedForVoting = useGameStore((state: any) => state.raisedForVoting);
  const [voteModeVoterId, setVoteModeVoterId] = useState<number | null>(null);

  const switchToNextPhase = () => {
    if (phase === "night acquaintance") {
      setPhase("day acquaintance");
      return;
    }

    if (phase === "day acquaintance" && raisedForVotingPlayers.length > 0) {
      setPhase("voting");
      navigate("/voting");
    } else if (
      phase === "day acquaintance" &&
      raisedForVotingPlayers.length === 0
    ) {
      setPhase("night");
    }
  };

  const displayedPlayers = [...players].sort(
    (a: any, b: any) => a.tableOrder - b.tableOrder,
  );

  const handleVoteTargetSelect = (targetId: number) => {
    if (voteModeVoterId === null) return;
    raisedForVoting(targetId);
    setVoteModeVoterId(null);
  };

  const buttonTextToDisplay =
    phase === "night acquaintance"
      ? "Go to Day Acquaintance"
      : phase === "day acquaintance" && raisedForVotingPlayers.length > 0
        ? `Voting stage (${raisedForVotingPlayers.length})`
        : "Go to night";

  return (
    <PageWrapper {...{ bgimage: backgroundImage }}>
      <SectionTitle>{phase.toUpperCase()}</SectionTitle>
      <PlayerCardsWrapper>
        {displayedPlayers.map((player: any) => (
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
      {raisedForVotingPlayers.length > 0}
      <GoToDayAcquaintanceButton onClick={switchToNextPhase}>
        {buttonTextToDisplay}
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
