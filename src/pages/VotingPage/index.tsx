import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useEffect, useState } from "react";
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
import { GameOverDialog } from "../../components/GameOverDialog";
import { CountdownTimer } from "../../components/CountdownTimer";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate } from "react-router-dom";

import HowToVoteRoundedIcon from "@mui/icons-material/HowToVoteRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

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
  const defenseTimer = useGameStore((state: any) => state.defenseTimer);
  const defenseTimerSecondsLeft = useGameStore(
    (state: any) => state.defenseTimerSecondsLeft,
  );
  const isDefenseTimerRunning = useGameStore(
    (state: any) => state.isDefenseTimerRunning,
  );
  const setDefenseTimerSecondsLeft = useGameStore(
    (state: any) => state.setDefenseTimerSecondsLeft,
  );
  const setDefenseTimerRunning = useGameStore(
    (state: any) => state.setDefenseTimerRunning,
  );
  const resetDefenseTimer = useGameStore(
    (state: any) => state.resetDefenseTimer,
  );
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [tieResolutionVotes, setTieResolutionVotes] = useState(0);

  const finalWordTimer = useGameStore((state: any) => state.finalWordTimer);
  const finalWordTimerSecondsLeft = useGameStore(
    (state: any) => state.finalWordTimerSecondsLeft,
  );
  const isFinalWordTimerRunning = useGameStore(
    (state: any) => state.isFinalWordTimerRunning,
  );
  const setFinalWordTimerSecondsLeft = useGameStore(
    (state: any) => state.setFinalWordTimerSecondsLeft,
  );
  const setFinalWordTimerRunning = useGameStore(
    (state: any) => state.setFinalWordTimerRunning,
  );
  const resetFinalWordTimer = useGameStore(
    (state: any) => state.resetFinalWordTimer,
  );

  useEffect(() => {
    resetDefenseTimer();
  }, []);

  useEffect(() => {
    resetFinalWordTimer();
  }, [votingResult, resetFinalWordTimer]);

  const alivePlayers = useMemo(
    () => players.filter((player: any) => player.isAlive),
    [players],
  );
  const eligibleVoterCount = useMemo(
    () => players.filter((player: any) => player.isAlive).length,
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
    mafiaAliveCount > 0 && mafiaAliveCount >= townAliveCount;

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
        mafiaStateAliveCount > 0 && mafiaStateAliveCount >= townStateAliveCount,
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

  const submitTieResolutionVote = () => {
    handleTieResolution(
      tieResolutionVotes > eligibleVoterCount / 2 ? "kick" : "leave",
    );
  };

  useEffect(() => {
    setTieResolutionVotes(0);
  }, [votingResult]);

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
          <CountdownTimer
            label="Defense time"
            secondsLeft={defenseTimerSecondsLeft}
            totalSeconds={defenseTimer}
            running={isDefenseTimerRunning}
            onSecondsChange={setDefenseTimerSecondsLeft}
            onRunningChange={setDefenseTimerRunning}
            onReset={resetDefenseTimer}
          />
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

      <Dialog
        open={Boolean(votingResult)}
        onClose={() => {
          if (votingResult?.type !== "tieResolution") {
            goToNight();
          }
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            overflow: "hidden",
            border: `1px solid ${votingResult?.type === "tieResolution" ? "rgba(251,191,36,0.25)" : votingResult?.eliminated ? "rgba(251,113,133,0.25)" : "rgba(74,222,128,0.22)"}`,
            background:
              "radial-gradient(ellipse at top left, rgba(22,101,52,0.16), transparent 58%), linear-gradient(145deg, #111827, #090e19)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            pt: 3,
            px: 3,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              flex: "0 0 auto",
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color:
                votingResult?.type === "tieResolution"
                  ? "#fcd34d"
                  : votingResult?.eliminated
                    ? "#fda4af"
                    : "#86efac",
              bgcolor:
                votingResult?.type === "tieResolution"
                  ? "rgba(245,158,11,0.13)"
                  : votingResult?.eliminated
                    ? "rgba(244,63,94,0.13)"
                    : "rgba(34,197,94,0.12)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {votingResult?.type === "tieResolution" ? (
              <GavelRoundedIcon />
            ) : (
              <HowToVoteRoundedIcon />
            )}
          </Box>
          <Box>
            <Typography
              sx={{
                color:
                  votingResult?.type === "tieResolution"
                    ? "#fcd34d"
                    : votingResult?.eliminated
                      ? "#fda4af"
                      : "#86efac",
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Round {round} · ballot report
            </Typography>
            <Typography
              component="div"
              sx={{ color: "#f8fafc", fontSize: "1.35rem", fontWeight: 750 }}
            >
              {votingResult?.type === "tieResolution"
                ? "The vote is tied"
                : votingResult?.eliminated
                  ? "Player eliminated"
                  : "No elimination"}
            </Typography>
          </Box>
        </DialogTitle>
        {votingResult?.eliminated && votingResult?.type !== "tieResolution" && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Divider sx={{ borderColor: "rgba(251,113,133,0.2)", mb: 2 }} />
            <CountdownTimer
              label="Final word"
              secondsLeft={finalWordTimerSecondsLeft}
              totalSeconds={finalWordTimer}
              running={isFinalWordTimerRunning}
              onSecondsChange={setFinalWordTimerSecondsLeft}
              onRunningChange={setFinalWordTimerRunning}
              onReset={resetFinalWordTimer}
              width="100%"
              accentColor="#fb7185"
            />
            <Divider sx={{ borderColor: "rgba(251,113,133,0.2)", mt: 2 }} />
          </Box>
        )}
        <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
          {votingResult?.type === "tieResolution" ? (
            <>
              <DialogContentText
                sx={{ color: "rgba(248,250,252,0.68)", mb: 2 }}
              >
                The tied candidates received equal votes. Record the table's
                decision below.
              </DialogContentText>
              <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
                {votingResult.tiedIds?.map((id: number) => {
                  const tiedPlayer = players.find(
                    (player: any) => player.id === id,
                  );
                  return (
                    <Box
                      key={id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid rgba(251,191,36,0.18)",
                        bgcolor: "rgba(245,158,11,0.055)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          display: "grid",
                          placeItems: "center",
                          flex: "0 0 auto",
                          borderRadius: 1.5,
                          bgcolor: "rgba(245,158,11,0.12)",
                          color: "#fcd34d",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                        }}
                      >
                        {String(tiedPlayer?.tableOrder ?? id).padStart(2, "0")}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            color: "#f8fafc",
                            fontWeight: 700,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {tiedPlayer?.nickname ?? `Player #${id}`}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(248,250,252,0.58)",
                            fontSize: "0.82rem",
                          }}
                        >
                          {tiedPlayer?.role ?? "Candidate"}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: "#fcd34d",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {votingResult.finalEntries?.[id] ??
                          votingResult.votesReceived}{" "}
                        votes
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </>
          ) : votingResult?.eliminated ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.75,
                  mb: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(251,113,133,0.2)",
                  bgcolor: "rgba(244,63,94,0.06)",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    flex: "0 0 auto",
                    borderRadius: 1.5,
                    bgcolor: "rgba(244,63,94,0.13)",
                    color: "#fda4af",
                  }}
                >
                  <CheckCircleRoundedIcon />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 750,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {votingResult.nickname}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(248,250,252,0.58)",
                      fontSize: "0.82rem",
                    }}
                  >
                    Received the most votes
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Typography
                    sx={{
                      color: "#fda4af",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    {votingResult.votesReceived}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(248,250,252,0.55)",
                      fontSize: "0.72rem",
                    }}
                  >
                    votes
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <DialogContentText sx={{ color: "rgba(248,250,252,0.68)", mb: 2 }}>
              No candidate received a vote this round.
            </DialogContentText>
          )}
          <DialogContentText sx={{ color: "rgba(248,250,252,0.66)" }}>
            {votingResult?.type === "tieResolution"
              ? `Enter the number of eligible voters who chose to eliminate the tied players. They are eliminated only if more than half of the ${eligibleVoterCount} eligible voters voted to remove them.`
              : votingResult
                ? `${votingResult.alivePlayersCount} players remain alive.`
                : "Proceed to night after confirming the result."}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            px: 3,
            pb: 3,
            pt: 1,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {votingResult?.type === "tieResolution" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1.5,
                width: "100%",
              }}
            >
              <TextField
                label="Votes to eliminate"
                type="number"
                value={tieResolutionVotes}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (Number.isInteger(value)) {
                    setTieResolutionVotes(
                      Math.min(Math.max(0, value), eligibleVoterCount),
                    );
                  }
                }}
                slotProps={{
                  input: {
                    inputProps: {
                      min: 0,
                      max: eligibleVoterCount,
                      step: 1,
                    },
                  },
                }}
                sx={{ width: "min(100%, 260px)" }}
              />
              <Button
                onClick={submitTieResolutionVote}
                variant="contained"
                startIcon={<GavelRoundedIcon />}
                sx={{
                  width: "100%",
                  borderRadius: 1.5,
                  py: 1.1,
                }}
              >
                Submit tie vote
              </Button>
            </Box>
          ) : (
            <Button
              onClick={goToNight}
              variant="contained"
              startIcon={<DoneRoundedIcon />}
              sx={{
                width: "100%",
                borderRadius: 1.5,
                py: 1.1,
              }}
            >
              Confirm and go to night
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <GameOverDialog
        open={showWinnerDialog}
        onClose={() => setShowWinnerDialog(false)}
        onReturnToLobby={() => {
          resetForLobby();
          navigate("/?openLobby=true");
        }}
        winner={isMafiaWinConditionMet ? "Mafia" : "Town"}
        message={
          isMafiaWinConditionMet
            ? "The remaining players are tied at a mafia win condition."
            : "All mafia roles were eliminated. The town wins."
        }
        players={players}
      />
    </PageWrapper>
  );
};
