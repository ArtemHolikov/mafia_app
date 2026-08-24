import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ContentShell,
  NightActionButton,
  NightActionsWrapper,
  PageWrapper,
  PlayerCardsWrapper,
  SectionTitle,
  TopBar,
} from "../AcquaintancePage/index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";
import { FlickeringBox, MafiaFlickeringBox } from "./index.styles";

import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const DayPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setPhase = useGameStore((state: any) => state.setPhase);
  const round = useGameStore((state: any) => state.round);
  const setRound = useGameStore((state: any) => state.setRound);
  const resetForLobby = useGameStore((state: any) => state.resetForLobby);
  const players = useGameStore((state: any) => state.players);
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
  const intervalRef = useRef<number | null>(null);
  const dayTimerSecondsRef = useRef<number>(dayTimerSecondsLeft);
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
  const hasAnyMafiaRole = mafiaAliveCount > 0;
  const hasAnyTownRole = townAliveCount > 0;
  const isMafiaWinConditionMet =
    hasAnyMafiaRole &&
    hasAnyTownRole &&
    mafiaAliveCount === townAliveCount &&
    [1, 2, 3].includes(mafiaAliveCount);
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
      setShowKilledDialog(true);
      setShowWinnerDialog(false);
    }
  }, [
    round,
    roundParam,
    setRound,
    setPhase,
    killedPlayers.length,
    resetDayTimer,
  ]);

  useEffect(() => {
    if (
      (!isMafiaWinConditionMet && !isTownWinConditionMet) ||
      showKilledDialog
    ) {
      return;
    }

    setPhase("gameOver");
    setShowWinnerDialog(true);
  }, [
    isMafiaWinConditionMet,
    isTownWinConditionMet,
    showKilledDialog,
    setPhase,
  ]);

  useEffect(() => {
    dayTimerSecondsRef.current = dayTimerSecondsLeft;
  }, [dayTimerSecondsLeft]);

  useEffect(() => {
    if (!isDayTimerRunning) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const currentSeconds = Number.isFinite(dayTimerSecondsRef.current)
        ? dayTimerSecondsRef.current
        : speechTimer;
      if (currentSeconds <= 1) {
        window.clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDayTimerRunning(false);
        setDayTimerSecondsLeft(0);
        dayTimerSecondsRef.current = 0;
        return;
      }

      const nextSeconds = currentSeconds - 1;
      dayTimerSecondsRef.current = nextSeconds;
      setDayTimerSecondsLeft(nextSeconds);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isDayTimerRunning,
    setDayTimerSecondsLeft,
    setDayTimerRunning,
    speechTimer,
  ]);

  const confirmKills = () => {
    if (killedPlayers.length > 0) {
      commitNightDeaths();
    }
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
    setSelectedPlayerId(playerId);
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
    if (isMafiaWinConditionMet || isTownWinConditionMet) {
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

  const handleTimerStart = () => setDayTimerRunning(true);
  const handleTimerStop = () => setDayTimerRunning(false);
  const handleTimerReset = () => resetDayTimer();

  const sortedPlayers = useMemo(
    () => [...players].sort((a: any, b: any) => a.tableOrder - b.tableOrder),
    [players],
  );

  const openingSpeaker = useMemo(() => {
    if (sortedPlayers.length === 0) return null;
    const startIndex = (roundParam - 1) % sortedPlayers.length;
    for (let i = 0; i < sortedPlayers.length; i += 1) {
      const index = (startIndex + i) % sortedPlayers.length;
      const player = sortedPlayers[index];
      if (player.isAlive) {
        return player;
      }
    }
    return null;
  }, [sortedPlayers, roundParam]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
              width: "100%",
            }}
          >
            <Box>
              <SectionTitle>{`Day — round ${roundParam}`}</SectionTitle>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
                Day actions for round {roundParam}. Proceed to the next night
                when ready.
              </Typography>
              <Typography
                sx={{ color: "rgba(248,250,252,0.72)", marginTop: 1 }}
              >
                Opening speaker:{" "}
                {openingSpeaker?.nickname ?? "No alive starter"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.18)",
                bgcolor: "rgba(255,255,255,0.04)",
                minWidth: 260,
                width: 260,
              }}
            >
              <Typography
                sx={{
                  color: "rgba(248,250,252,0.72)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                }}
              >
                Speaker time
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    textAlign: "center",
                  }}
                >
                  {formatTime(
                    Number.isFinite(dayTimerSecondsLeft)
                      ? dayTimerSecondsLeft
                      : speechTimer,
                  )}
                </Typography>
                <Box>
                  <IconButton
                    onClick={
                      isDayTimerRunning ? handleTimerStop : handleTimerStart
                    }
                  >
                    <PlayCircleFilledIcon />
                  </IconButton>
                  <IconButton onClick={handleTimerReset}>
                    <RestartAltIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                px: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.18)",
                bgcolor: "rgba(255,255,255,0.04)",
                minWidth: 260,
                padding: "15px 24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(248,250,252,0.72)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Town
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FlickeringBox />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.35rem",
                    }}
                  >
                    {townAliveCount}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(248,250,252,0.72)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Total
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.35rem",
                    }}
                  >
                    {aliveCount}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(248,250,252,0.72)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Mafia
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MafiaFlickeringBox />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.35rem",
                    }}
                  >
                    {mafiaAliveCount}
                  </Typography>
                </Box>
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
            onDayPlayerSelect={handleSelectPlayer}
          />
        ))}
      </PlayerCardsWrapper>

      <NightActionsWrapper>
        <NightActionButton
          onClick={handleGiveFoul}
          disabled={
            !selectedPlayer ||
            isMafiaWinConditionMet ||
            isTownWinConditionMet ||
            foulWasGivenForSelection ||
            nominationWasGivenForSelection
          }
          sx={{ background: "rgba(56,189,248,0.92)", minWidth: 170 }}
        >
          Give foul +1
        </NightActionButton>

        <NightActionButton
          onClick={handleNominatePlayer}
          disabled={
            !selectedPlayer ||
            nominationWasGivenForSelection ||
            foulWasGivenForSelection ||
            selectedPlayerAlreadyRaised ||
            isMafiaWinConditionMet ||
            isTownWinConditionMet
          }
          sx={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",
            minWidth: 190,
          }}
        >
          Nominate player
        </NightActionButton>

        <NightActionButton
          onClick={goToNight}
          disabled={isMafiaWinConditionMet || isTownWinConditionMet}
          sx={{ minWidth: 190 }}
        >
          {raisedForVotingPlayers.length > 0
            ? `Open voting (${raisedForVotingPlayers.length})`
            : "Proceed to night"}
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

      <Dialog open={showKilledDialog} onClose={confirmKills}>
        <DialogTitle>Killed players</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {killedPlayers.length > 0
              ? `The following player${killedPlayers.length > 1 ? "s were" : " was"} targeted during the night:`
              : "No players were killed during the night."}
          </DialogContentText>
          {killedPlayers.map((player: any) => (
            <DialogContentText key={player.id} sx={{ mt: 1 }}>
              {player.tableOrder} | {player.nickname} — {player.role}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmKills} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showWinnerDialog}
        onClose={() => setShowWinnerDialog(false)}
      >
        <DialogTitle>
          {isTownWinConditionMet ? "Town wins" : "Mafia wins"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isTownWinConditionMet
              ? "All mafia members have been eliminated. Town wins the game!"
              : "Mafia reached a tied score with the town and wins the game."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnToLobby} variant="contained">
            Back to lobby settings
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};
