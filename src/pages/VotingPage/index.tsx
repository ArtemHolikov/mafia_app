import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
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
import { useNavigate } from "react-router-dom";

export const VotingPage = () => {
  const navigate = useNavigate();
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );
  const votingResult = useGameStore((state: any) => state.votingResult);
  const clearVotingResult = useGameStore(
    (state: any) => state.clearVotingResult,
  );
  const resolveTieResolution = useGameStore(
    (state: any) => state.resolveTieResolution,
  );
  const setPhase = useGameStore((state: any) => state.setPhase);

  const round = useGameStore((state: any) => state.round);

  const goToNight = () => {
    const nextRound = Math.max(1, round);
    setPhase("night");
    clearVotingResult();
    navigate(`/night?round=${nextRound}`);
  };

  const handleTieResolution = (decision: "leave" | "kick") => {
    resolveTieResolution(decision);
    goToNight();
  };

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box>
            <SectionTitle>
              Voting{round > 0 ? ` — round ${round}` : ""}
            </SectionTitle>
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

      <GoToDayAcquaintanceButton onClick={goToNight}>
        Return to night
      </GoToDayAcquaintanceButton>

      <Dialog open={Boolean(votingResult)} onClose={goToNight}>
        <DialogTitle>
          {votingResult?.type === "tieResolution"
            ? "Tie resolution"
            : "Voting results"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {votingResult?.type === "tieResolution"
              ? `Both ${votingResult.tiedIds?.map((id: number) => `#${id}`).join(" and ")} received the same number of votes. Decide whether to eliminate both players.`
              : votingResult
                ? votingResult.eliminated
                  ? `${votingResult.nickname} has been voted out with ${votingResult.votesReceived} vote(s).`
                  : "No player was eliminated this round."
                : "Voting results are ready."}
          </DialogContentText>
          <DialogContentText sx={{ color: "rgba(248,250,252,0.75)" }}>
            {votingResult?.type === "tieResolution"
              ? "If most alive players vote to remove both tied players, they will be eliminated. Otherwise they stay alive and the game goes to night."
              : votingResult
                ? `Alive players remaining: ${votingResult.alivePlayersCount}`
                : "Proceed to night after confirming the result."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          {votingResult?.type === "tieResolution" ? (
            <>
              <Button
                onClick={() => handleTieResolution("leave")}
                color="inherit"
              >
                Leave both
              </Button>
              <Button
                onClick={() => handleTieResolution("kick")}
                variant="contained"
                color="error"
              >
                Kick both
              </Button>
            </>
          ) : (
            <Button onClick={goToNight} variant="contained" sx={{ mr: 1 }}>
              Confirm and go to night
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};
