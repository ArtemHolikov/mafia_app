import { Box } from "@mui/material";
import { PageWrapper, PlayerCardsWrapper, SectionTitle } from "./index.styles";

import backgroundImage from "../../images/backgroundPhoto.png";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "./components/PlayerCard";

export const AcquaintancePage = () => {
  const players = useGameStore((state: any) => state.players);
  const phase = useGameStore((state: any) => state.phase);

  return (
    <PageWrapper {...{ bgimage: backgroundImage }}>
      <SectionTitle>{phase.toUpperCase()}</SectionTitle>
      <PlayerCardsWrapper>
        {players.map((player: any) => (
          <PlayerCard
            nickname={player.nickname}
            role={player.role}
            tableOrder={player.tableOrder}
          />
        ))}
      </PlayerCardsWrapper>
    </PageWrapper>
  );
};
