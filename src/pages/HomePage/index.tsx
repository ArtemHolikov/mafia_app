import { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  AppWrapper,
  HeroCard,
  HeroTitle,
  HeroSubtitle,
  StartGameButton,
  FeatureList,
  FeatureChip,
} from "./index.styles";
import { StartGameDialog } from "../../components/StartGameDialog";
import backgroundImage from "../../images/backgroundPhoto.png";

export const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AppWrapper bgimage={backgroundImage}>
      <HeroCard>
        <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.8 }}>
          Mafia Manager
        </Typography>
        <HeroTitle>Run your game with confidence.</HeroTitle>
        <HeroSubtitle>
          Create players, move through phases, and keep the table flowing with a
          smoother, more polished experience.
        </HeroSubtitle>
        <FeatureList>
          <FeatureChip label="Live player lobby" />
          <FeatureChip label="Phase-driven flow" />
          <FeatureChip label="Modern UI" />
        </FeatureList>
        <StartGameButton onClick={() => setIsOpen(true)}>
          Start game
        </StartGameButton>
      </HeroCard>
      <StartGameDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </AppWrapper>
  );
};
