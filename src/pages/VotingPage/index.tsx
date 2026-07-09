import { Box, Typography } from "@mui/material";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionChip,
  SectionTitle,
  TopBar,
} from "../AcquaintancePage/index.styles";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";
import backgroundImage from "../../images/backgroundPhoto.png";

export const VotingPage = () => {
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box>
            <SectionTitle>Voting</SectionTitle>
            <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
              Review the players who have been raised for discussion.
            </Typography>
          </Box>
          <SectionChip>{raisedForVotingPlayers.length} nominated</SectionChip>
        </TopBar>

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
      </ContentShell>

      <GoToDayAcquaintanceButton>Return to night</GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
