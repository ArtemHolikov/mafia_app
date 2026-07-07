import { Box } from "@mui/material";
import {
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionTitle,
} from "../AcquaintancePage/index.styles";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";

import backgroundImage from "../../images/backgroundPhoto.png";
import { useEffect } from "react";

export const VotingPage = () => {
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );
  const phase = useGameStore((state: any) => state.phase);

  useEffect(() => {
    console.log(raisedForVotingPlayers);
  });

  return (
    <PageWrapper {...{ bgimage: backgroundImage }}>
      <SectionTitle>{phase.toUpperCase()}</SectionTitle>
      <PlayerCardsWrapper>
        {raisedForVotingPlayers.map((player: any) => (
          <PlayerCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            role={player.role}
            tableOrder={player.tableOrder}
          />
        ))}
      </PlayerCardsWrapper>
      {raisedForVotingPlayers.length > 0}
      <GoToDayAcquaintanceButton>Go To Night</GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
