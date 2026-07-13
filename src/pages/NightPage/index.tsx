import { Box, Button, Typography } from "@mui/material";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionTitle,
  TopBar,
} from "../AcquaintancePage/index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";

export const NightPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setPhase = useGameStore((state: any) => state.setPhase);
  const round = useGameStore((state: any) => state.round);
  const setRound = useGameStore((state: any) => state.setRound);
  const players = useGameStore((state: any) => state.players);

  const filteredPlayers = players.filter((player: any) => player.isAlive);

  const roundParam = Number(searchParams.get("round") ?? round) || 1;

  useEffect(() => {
    if (roundParam !== round) {
      setRound(roundParam);
    }
    setPhase("night");
  }, [round, roundParam, setRound, setPhase]);

  const goToDay = () => {
    setPhase("day");
    navigate(`/day?round=${roundParam}`);
  };

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box>
            <SectionTitle>{`Night — round ${roundParam}`}</SectionTitle>
            <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
              Night actions for round {roundParam}. Proceed to the next day when
              ready.
            </Typography>
          </Box>
          <Typography sx={{ color: "rgba(248,250,252,0.8)" }}>
            Round {roundParam}
          </Typography>
        </TopBar>
      </ContentShell>

      <PlayerCardsWrapper>
        {filteredPlayers.map((player: any) => (
          <PlayerCard
            id={player.id}
            nickname={player.nickname}
            tableOrder={player.tableOrder}
            role={player.role}
          />
        ))}
      </PlayerCardsWrapper>

      <GoToDayAcquaintanceButton onClick={goToDay}>
        Proceed to day
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
