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
import { useMemo } from "react";
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
import { useState } from "react";

export const VotingPage = () => {
  const navigate = useNavigate();
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );
  const players = useGameStore((state: any) => state.players);
  const votingResult = useGameStore((state: any) => state.votingResult);
  const clearVotingResult = useGameStore(
    (state: any) => state.clearVotingResult,
  );
  const clearRaisedForVoting = useGameStore(
    (state: any) => state.clearRaisedForVoting,
  );
  const resetForLobby = useGameStore((state: any) => state.resetForLobby);
  const resolveTieResolution = useGameStore(
    (state: any) => state.resolveTieResolution,
  );
  const setPhase = useGameStore((state: any) => state.setPhase);

  const round = useGameStore((state: any) => state.round);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  const alivePlayers = useMemo(
    () => players.filter((player: any) => player.isAlive),
    [players],
  );
  const mafiaRoles = new Set(["Don", "Mafia", "Thief"]);
  const mafiaAliveCount = alivePlayers.filter((player: any) =>
    mafiaRoles.has(player.role),
  ).length;
  const townAliveCount = alivePlayers.filter(
    (player: any) => !mafiaRoles.has(player.role),
  ).length;
  const isMafiaWinConditionMet =
    mafiaAliveCount > 0 &&
    mafiaAliveCount === townAliveCount &&
    [1, 2, 3].includes(mafiaAliveCount);

  const getVictoryState = (playersState: any[] = players) => {
    const aliveStatePlayers = playersState.filter(
      (player: any) => player.isAlive,
    );
    const mafiaStateAliveCount = aliveStatePlayers.filter((player: any) =>
      mafiaRoles.has(player.role),
    ).length;
    const townStateAliveCount = aliveStatePlayers.filter(
      (player: any) => !mafiaRoles.has(player.role),
    ).length;

    return {
      isMafiaWinConditionMet:
        mafiaStateAliveCount > 0 &&
        mafiaStateAliveCount === townStateAliveCount &&
        [1, 2, 3].includes(mafiaStateAliveCount),
      isTownWinConditionMet:
        mafiaStateAliveCount === 0 && townStateAliveCount > 0,
    };
  };

  const goToNight = () => {
    const victoryState = getVictoryState();

    if (
      victoryState.isMafiaWinConditionMet ||
      victoryState.isTownWinConditionMet
    ) {
      setShowWinnerDialog(true);
      return;
    }

    const nextRound = round + 1;
    setPhase("night");
    clearVotingResult();
    clearRaisedForVoting();
    navigate(`/night?round=${nextRound}`);
  };

  const handleTieResolution = (decision: "leave" | "kick") => {
    resolveTieResolution(decision);

    const updatedPlayers = useGameStore.getState().players;
    const victoryState = getVictoryState(updatedPlayers);

    if (
      victoryState.isMafiaWinConditionMet ||
      victoryState.isTownWinConditionMet
    ) {
      setShowWinnerDialog(true);
      return;
    }

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

      <Dialog
        open={showWinnerDialog}
        onClose={() => setShowWinnerDialog(false)}
      >
        <DialogTitle>
          {isMafiaWinConditionMet ? "Mafia wins" : "Town wins"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isMafiaWinConditionMet
              ? "The remaining players are tied at a mafia win condition."
              : "All mafia roles were eliminated. The town wins."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              resetForLobby();
              navigate("/?openLobby=true");
            }}
            variant="contained"
          >
            Back to lobby settings
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};
