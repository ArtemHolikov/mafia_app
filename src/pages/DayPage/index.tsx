import { Box, Button, Typography } from "@mui/material";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  PageWrapper,
  SectionTitle,
  TopBar,
} from "../AcquaintancePage/index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";

export const DayPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setPhase = useGameStore((state: any) => state.setPhase);
  const round = useGameStore((state: any) => state.round);
  const setRound = useGameStore((state: any) => state.setRound);

  const roundParam = Number(searchParams.get("round") ?? round) || 1;

  useEffect(() => {
    if (roundParam !== round) {
      setRound(roundParam);
    }
    setPhase("day");
  }, [round, roundParam, setRound, setPhase]);

  const goToNight = () => {
    const nextNightRound = roundParam + 1;
    setPhase("night");
    setRound(nextNightRound);
    navigate(`/night?round=${nextNightRound}`);
  };

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box>
            <SectionTitle>{`Day — round ${roundParam}`}</SectionTitle>
            <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
              Day actions for round {roundParam}. Proceed to the next night when
              ready.
            </Typography>
          </Box>
          <Typography sx={{ color: "rgba(248,250,252,0.8)" }}>
            Round {roundParam}
          </Typography>
        </TopBar>
      </ContentShell>

      <GoToDayAcquaintanceButton onClick={goToNight}>
        Proceed to night
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
