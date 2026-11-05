import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import {
  ContentShell,
  NightActionButton,
  NightActionsWrapper,
  PageWrapper,
  PlayerCardsWrapper,
  TopBar,
} from "../AcquaintancePage/index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";
import { GameOverDialog } from "../../components/GameOverDialog";
import { CountdownTimer } from "../../components/CountdownTimer";

import NightsStayRoundedIcon from "@mui/icons-material/NightsStayRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import HowToVoteRoundedIcon from "@mui/icons-material/HowToVoteRounded";

const StatItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 0,
      maxWidth: "100%",
    }}
  >
    <Typography
      sx={{
        color: "rgba(248,250,252,0.5)",
        fontSize: { xs: "0.62rem", sm: "0.7rem" },
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        color,
        fontWeight: 600,
        lineHeight: 1.2,
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: { xs: "1.2rem", sm: "1.4rem" },
      }}
    >
      {value}
    </Typography>
  </Box>
);

export const DayPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setPhase = useGameStore((state: any) => state.setPhase);
  const round = useGameStore((state: any) => state.round);
  const setRound = useGameStore((state: any) => state.setRound);
  const resetForLobby = useGameStore((state: any) => state.resetForLobby);
  const players = useGameStore((state: any) => state.players);
  const clearNightMarks = useGameStore((state: any) => state.clearNightMarks);
  const commitNightDeaths = useGameStore(
    (state: any) => state.commitNightDeaths,
  );

  const roundParam = Number(searchParams.get("round") ?? round) || 1;
  const speechTimer = useGameStore((state: any) => state.speechTimer);
  const dayTimerSecondsLeft = useGameStore(
    (state: any) => state.dayTimerSecondsLeft,
  );
  const isDayTimerRunning = useGameStore(
    (state: any) => state.isDayTimerRunning,
  );
  const setDayTimerSecondsLeft = useGameStore(
    (state: any) => state.setDayTimerSecondsLeft,
  );
  const setDayTimerRunning = useGameStore(
    (state: any) => state.setDayTimerRunning,
  );
  const resetDayTimer = useGameStore((state: any) => state.resetDayTimer);
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
  const [showKilledDialog, setShowKilledDialog] = useState(false);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [foulFeedback, setFoulFeedback] = useState<string | null>(null);
  const [foulWasGivenForSelection, setFoulWasGivenForSelection] =
    useState(false);
  const foulWasGivenForSelectionRef = useRef(false);
  const [nominationWasGivenForSelection, setNominationWasGivenForSelection] =
    useState(false);
  const nominationWasGivenForSelectionRef = useRef(false);
  const alivePlayers = useMemo(
    () => players.filter((player: any) => player.isAlive),
    [players],
  );
  const aliveCount = alivePlayers.length;
  const mafiaRoles = new Set(["Don", "Mafia", "Thief"]);
  const mafiaAliveCount = alivePlayers.filter((player: any) =>
    mafiaRoles.has(player.role),
  ).length;
  const townAliveCount = alivePlayers.filter(
    (player: any) => !mafiaRoles.has(player.role),
  ).length;
  const isDrawConditionMet = aliveCount === 0;
  const isMafiaWinConditionMet =
    mafiaAliveCount > 0 && mafiaAliveCount >= townAliveCount;
  const isTownWinConditionMet = mafiaAliveCount === 0 && townAliveCount > 0;
  const killedPlayers = useMemo(
    () =>
      players.filter(
        (player: any) => player.pendingMafiaKill || player.pendingManiacKill,
      ),
    [players],
  );

  useEffect(() => {
    if (roundParam !== round) {
      setRound(roundParam);
    }
    setPhase("day");
    setSelectedPlayerId(null);
    foulWasGivenForSelectionRef.current = false;
    setFoulWasGivenForSelection(false);
    nominationWasGivenForSelectionRef.current = false;
    setNominationWasGivenForSelection(false);

    resetDayTimer();

    if (killedPlayers.length > 0) {
      resetFinalWordTimer();
      setShowKilledDialog(true);
      setShowWinnerDialog(false);
    } else {
      // No kills to commit, so drop leftover night marks (e.g. Thief block)
      clearNightMarks();
    }
  }, [
    round,
    roundParam,
    setRound,
    setPhase,
    clearNightMarks,
    killedPlayers.length,
    resetDayTimer,
    resetFinalWordTimer,
  ]);

  useEffect(() => {
    if (
      (!isMafiaWinConditionMet &&
        !isTownWinConditionMet &&
        !isDrawConditionMet) ||
      showKilledDialog
    ) {
      return;
    }

    setPhase("gameOver");
    setShowWinnerDialog(true);
  }, [
    isMafiaWinConditionMet,
    isTownWinConditionMet,
    isDrawConditionMet,
    showKilledDialog,
    setPhase,
  ]);

  const confirmKills = () => {
    if (killedPlayers.length > 0) {
      commitNightDeaths();
    }
    setFinalWordTimerRunning(false);
    setShowKilledDialog(false);
  };

  const handleReturnToLobby = () => {
    resetForLobby();
    navigate("/?openLobby=true");
  };

  const addFoul = useGameStore((state: any) => state.addFoul);
  const raisedForVoting = useGameStore((state: any) => state.raisedForVoting);
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );
  const clearRaisedForVoting = useGameStore(
    (state: any) => state.clearRaisedForVoting,
  );

  const selectedPlayer = alivePlayers.find(
    (player: any) => player.id === selectedPlayerId,
  );

  const selectedPlayerAlreadyRaised = Boolean(
    selectedPlayer &&
    raisedForVotingPlayers.some(
      (player: any) => player.id === selectedPlayer.id,
    ),
  );

  const handleSelectPlayer = (playerId: number) => {
    setSelectedPlayerId(playerId === selectedPlayerId ? null : playerId);
    foulWasGivenForSelectionRef.current = false;
    setFoulWasGivenForSelection(false);
    nominationWasGivenForSelectionRef.current = false;
    setNominationWasGivenForSelection(false);
  };

  const handleGiveFoul = () => {
    if (!selectedPlayer || foulWasGivenForSelectionRef.current) {
      return;
    }

    foulWasGivenForSelectionRef.current = true;
    setFoulWasGivenForSelection(true);
    addFoul(selectedPlayer.id);

    const nextFouls = (selectedPlayer.fouls ?? 0) + 1;
    setFoulFeedback(
      `${selectedPlayer.nickname} received a foul (${nextFouls}).`,
    );
    setSelectedPlayerId(null);
    setFoulWasGivenForSelection(false);
    setNominationWasGivenForSelection(false);
  };

  const handleNominatePlayer = () => {
    if (
      !selectedPlayer ||
      nominationWasGivenForSelectionRef.current ||
      selectedPlayerAlreadyRaised
    ) {
      return;
    }

    nominationWasGivenForSelectionRef.current = true;
    setNominationWasGivenForSelection(true);
    raisedForVoting(selectedPlayer.id);
    setSelectedPlayerId(null);
    setFoulWasGivenForSelection(false);
    setNominationWasGivenForSelection(false);
  };

  useEffect(() => {
    if (!foulFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFoulFeedback(null);
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [foulFeedback]);

  const goToNight = () => {
    if (isMafiaWinConditionMet || isTownWinConditionMet || isDrawConditionMet) {
      setShowWinnerDialog(true);
      return;
    }

    // If there are players raised for voting, move to voting stage instead
    if (raisedForVotingPlayers.length > 0) {
      setPhase("voting");
      navigate("/voting");
      return;
    }

    clearRaisedForVoting();

    const nextNightRound = roundParam + 1;
    setPhase("night");
    setRound(nextNightRound);
    navigate(`/night?round=${nextNightRound}`);
  };

  const sortedPlayers = useMemo(
    () => [...players].sort((a: any, b: any) => a.tableOrder - b.tableOrder),
    [players],
  );

  const openingSpeaker = useMemo(() => {
    if (sortedPlayers.length === 0) return null;
    const startIndex = roundParam % sortedPlayers.length;
    for (let i = 0; i < sortedPlayers.length; i += 1) {
      const index = (startIndex + i) % sortedPlayers.length;
      const player = sortedPlayers[index];
      if (player.isAlive) {
        return player;
      }
    }
    return null;
  }, [sortedPlayers, roundParam]);

  return (
    <PageWrapper
      bgimage={backgroundImage}
      sx={{
        "@media (max-width: 600px)": {
          paddingBottom: "calc(110px + env(safe-area-inset-bottom))",
        },
      }}
    >
      <ContentShell>
        <TopBar>
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
              width: "100%",
              "@media (max-width: 600px)": {
                gap: 1.5,
                "& > *": {
                  minWidth: 0,
                  width: "100%",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 3 },
                p: { xs: 1.25, sm: "12px 20px" },
                borderRadius: { xs: "14px", sm: "18px" },
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(12px)",
                "@media (max-width: 600px)": {
                  justifyContent: "space-around",
                },
              }}
            >
              <StatItem
                label="Day"
                value={`Round ${roundParam}`}
                color="#f8fafc"
              />
              <Box
                sx={{
                  alignSelf: "stretch",
                  width: "1px",
                  bgcolor: "rgba(255,255,255,0.1)",
                }}
              />
              <StatItem
                label="Opening speaker"
                value={openingSpeaker?.nickname ?? "—"}
                color="#5eead4"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2.5,
                p: "12px 20px",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(12px)",
                "@media (max-width: 600px)": {
                  gap: 1.5,
                  width: "100%",
                  minWidth: 0,
                  flexWrap: "nowrap",
                  p: 1.25,
                  borderRadius: "14px",
                },
              }}
            >
              <CountdownTimer
                label="Speaker time"
                secondsLeft={dayTimerSecondsLeft}
                totalSeconds={speechTimer}
                running={isDayTimerRunning}
                onSecondsChange={setDayTimerSecondsLeft}
                onRunningChange={setDayTimerRunning}
                onReset={resetDayTimer}
                mobileInline
                compact
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 3 },
                  pl: { xs: 1.5, sm: 3 },
                  borderLeft: "1px solid rgba(255,255,255,0.1)",
                  "@media (max-width: 600px)": {
                    flex: "1 1 50%",
                    minWidth: 0,
                    justifyContent: "space-around",
                  },
                }}
              >
                <StatItem label="Town" value={townAliveCount} color="#86efac" />
                <StatItem
                  label="Mafia"
                  value={mafiaAliveCount}
                  color="#fda4af"
                />
                <StatItem label="Total" value={aliveCount} color="#f8fafc" />
              </Box>
            </Box>
          </Box>
        </TopBar>
      </ContentShell>

      <PlayerCardsWrapper>
        {alivePlayers.map((player: any) => (
          <PlayerCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            tableOrder={player.tableOrder}
            role={player.role}
            selectedForDay={player.id === selectedPlayerId}
            onDayPlayerSelect={handleSelectPlayer}
          />
        ))}
      </PlayerCardsWrapper>

      <NightActionsWrapper
        sx={{
          "@media (max-width: 600px)": {
            bottom: "calc(12px + env(safe-area-inset-bottom))",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        <NightActionButton
          onClick={handleGiveFoul}
          disabled={
            !selectedPlayer ||
            isMafiaWinConditionMet ||
            isTownWinConditionMet ||
            isDrawConditionMet ||
            foulWasGivenForSelection ||
            nominationWasGivenForSelection
          }
          aria-label="Give foul +1"
          startIcon={<ReportProblemRoundedIcon />}
          sx={{
            background: "rgba(56,189,248,0.16)",
            color: "#7dd3fc",
            border: "1px solid rgba(56,189,248,0.35)",
            boxShadow: "none",
            "&:hover": { background: "rgba(56,189,248,0.26)" },
            minWidth: 170,
            "@media (max-width: 600px)": {
              "& .MuiButton-startIcon": { mr: 0.5, ml: 0 },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Give foul +1
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Foul +1
          </Box>
        </NightActionButton>

        <NightActionButton
          onClick={handleNominatePlayer}
          disabled={
            !selectedPlayer ||
            nominationWasGivenForSelection ||
            foulWasGivenForSelection ||
            selectedPlayerAlreadyRaised ||
            isMafiaWinConditionMet ||
            isTownWinConditionMet ||
            isDrawConditionMet
          }
          sx={{
            background: "rgba(34,197,94,0.16)",
            color: "#86efac",
            border: "1px solid rgba(34,197,94,0.35)",
            boxShadow: "none",
            "&:hover": { background: "rgba(34,197,94,0.26)" },
            minWidth: 190,
            "@media (max-width: 600px)": {
              "& .MuiButton-startIcon": { mr: 0.5, ml: 0 },
            },
          }}
          aria-label="Nominate player"
          startIcon={<HowToVoteRoundedIcon />}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Nominate player
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Nominate
          </Box>
        </NightActionButton>

        <NightActionButton
          onClick={goToNight}
          disabled={
            isMafiaWinConditionMet ||
            isTownWinConditionMet ||
            isDrawConditionMet
          }
          sx={{
            minWidth: 190,
            "@media (max-width: 600px)": {
              "& .MuiButton-startIcon": { mr: 0.5, ml: 0 },
            },
          }}
          aria-label={
            raisedForVotingPlayers.length > 0
              ? `Open voting with ${raisedForVotingPlayers.length} nominated players`
              : "Proceed to night"
          }
          startIcon={<NightsStayRoundedIcon />}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            {raisedForVotingPlayers.length > 0
              ? `Open voting (${raisedForVotingPlayers.length})`
              : "Proceed to night"}
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            {raisedForVotingPlayers.length > 0
              ? `Vote (${raisedForVotingPlayers.length})`
              : "Night"}
          </Box>
        </NightActionButton>
      </NightActionsWrapper>

      {foulFeedback && (
        <Box
          sx={{
            position: "fixed",
            bottom: 84,
            left: "50%",
            transform: "translateX(-50%)",
            px: 2,
            py: 1,
            borderRadius: 999,
            border: "1px solid rgba(56,189,248,0.5)",
            background:
              "linear-gradient(120deg, rgba(14,116,144,0.85), rgba(2,132,199,0.85))",
            color: "#f8fafc",
            fontWeight: 600,
            fontSize: "0.9rem",
            zIndex: 12,
            boxShadow: "0 10px 24px rgba(14,116,144,0.35)",
          }}
        >
          {foulFeedback}
        </Box>
      )}

      <Dialog
        open={showKilledDialog}
        onClose={confirmKills}
        fullWidth
        maxWidth="sm"
        sx={{
          "@media (max-width: 600px)": {
            "& .MuiDialog-container": {
              alignItems: "stretch",
            },
          },
          "& .MuiDialog-paper": {
            overflow: "hidden",
            border: "1px solid rgba(251,113,133,0.24)",
            background:
              "radial-gradient(ellipse at top left, rgba(136,19,55,0.2), transparent 58%), linear-gradient(145deg, #111827, #090e19)",
            "@media (max-width: 600px)": {
              width: "100%",
              maxWidth: "none",
              height: "100%",
              maxHeight: "none",
              minHeight: "100dvh",
              margin: 0,
              border: 0,
              borderRadius: 0,
            },
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
            "@media (max-width: 600px)": {
              pt: "calc(24px + env(safe-area-inset-top))",
              px: 2.5,
            },
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
              color: "#fda4af",
              bgcolor: "rgba(244,63,94,0.13)",
              border: "1px solid rgba(251,113,133,0.25)",
            }}
          >
            <NightsStayRoundedIcon />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fda4af",
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Night report
            </Typography>
            <Typography
              component="div"
              sx={{ color: "#f8fafc", fontSize: "1.35rem", fontWeight: 750 }}
            >
              {killedPlayers.length > 0 ? "Players targeted" : "No casualties"}
            </Typography>
          </Box>
          <Box
            sx={{
              ml: "auto",
              px: 1.25,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.06)",
              color: "rgba(248,250,252,0.78)",
              fontSize: "0.78rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {killedPlayers.length}{" "}
            {killedPlayers.length === 1 ? "player" : "players"}
          </Box>
        </DialogTitle>
        {killedPlayers.length > 0 && (
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
        <DialogContent
          sx={{
            px: 3,
            pt: 1,
            pb: 2,
            "@media (max-width: 600px)": {
              px: 2.5,
            },
          }}
        >
          <DialogContentText sx={{ color: "rgba(248,250,252,0.66)", mb: 2 }}>
            {killedPlayers.length > 0
              ? "These players were marked during the night. Confirm to apply the results."
              : "No players were targeted. Confirm to begin the day."}
          </DialogContentText>
          <Box sx={{ display: "grid", gap: 1 }}>
            {killedPlayers.map((player: any) => (
              <Box
                key={player.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid rgba(251,113,133,0.18)",
                  bgcolor: "rgba(244,63,94,0.055)",
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    flex: "0 0 auto",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 1.5,
                    bgcolor: "rgba(251,113,133,0.12)",
                    color: "#fda4af",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                  }}
                >
                  {String(player.tableOrder).padStart(2, "0")}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      color: "#f8fafc",
                      fontWeight: 700,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {player.nickname}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(248,250,252,0.58)",
                      fontSize: "0.82rem",
                    }}
                  >
                    {player.role}
                  </Typography>
                </Box>
                <PersonOffRoundedIcon
                  sx={{ color: "#fb7185", flex: "0 0 auto" }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            px: 3,
            pb: 3,
            pt: 1,
            "@media (max-width: 600px)": {
              px: 2.5,
              pb: "calc(24px + env(safe-area-inset-bottom))",
            },
          }}
        >
          <Button
            onClick={confirmKills}
            variant="contained"
            startIcon={<DoneRoundedIcon />}
            sx={{
              width: "100%",
              px: 2.5,
              py: 1.1,
              borderRadius: 1.5,
              bgcolor: "#e11d48",
              "&:hover": { bgcolor: "#be123c" },
            }}
          >
            Confirm night report
          </Button>
        </DialogActions>
      </Dialog>

      <GameOverDialog
        open={showWinnerDialog}
        onClose={() => setShowWinnerDialog(false)}
        onReturnToLobby={handleReturnToLobby}
        winner={
          isDrawConditionMet ? "Draw" : isTownWinConditionMet ? "Town" : "Mafia"
        }
        message={
          isDrawConditionMet
            ? "No players remain alive. The game ends in a draw."
            : isTownWinConditionMet
              ? "All mafia members have been eliminated. Town wins the game!"
              : "Mafia reached a tied score with the town and wins the game."
        }
        players={players}
      />
    </PageWrapper>
  );
};
