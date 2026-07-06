import { Box } from "@mui/material";
import { PageWrapper, PlayerCardsWrapper } from "./index.styles";

import backgroundImage from "../../images/backgroundPhoto.png";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "./components/PlayerCard";

export const AcquaintancePage = () => {
  const players = useGameStore((state: any) => state.players);

  console.log(players);

  return (
    <PageWrapper {...{ bgimage: backgroundImage }}>
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
