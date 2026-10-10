import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  AppWrapper,
  HeroCard,
  HeroTitle,
  HeroSubtitle,
  StartGameButton,
  ResetGameButton,
  FeatureList,
  FeatureChip,
} from "./index.styles";
import { StartGameDialog } from "../../components/StartGameDialog";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useSearchParams } from "react-router-dom";

export const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("openLobby") === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  return (
    <AppWrapper bgimage={backgroundImage}>
      <HeroCard>
        <Box
          sx={{
            "@media (max-width: 600px)": {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            },
          }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, opacity: 0.8 }}
          >
            Mafia Manager
          </Typography>
          <HeroTitle>Run your game with confidence.</HeroTitle>
          <HeroSubtitle>
            Create players, move through phases, and keep the table flowing
            with a smoother, more polished experience.
          </HeroSubtitle>
          <FeatureList>
            <FeatureChip label="Live player lobby" />
            <FeatureChip label="Phase-driven flow" />
            <FeatureChip label="Modern UI" />
          </FeatureList>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mt: { xs: "auto", sm: 0 },
            "@media (max-width: 600px)": {
              flexDirection: "column",
              width: "100%",
            },
          }}
        >
          <StartGameButton onClick={() => setIsOpen(true)}>
            Start game
          </StartGameButton>
          <ResetGameButton
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Reset game
          </ResetGameButton>
        </Box>
      </HeroCard>
      <StartGameDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </AppWrapper>
  );
};
