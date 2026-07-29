import { Box, IconButton, Typography } from "@mui/material";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionChip,
  SectionTitle,
  TopBar,
} from "./index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "./components/PlayerCard";
import { useNavigate } from "react-router-dom";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const AcquaintancePage = () => {
  const navigate = useNavigate();
  const players = useGameStore((state: any) => state.players);
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );
  const phase = useGameStore((state: any) => state.phase);
  const setPhase = useGameStore((state: any) => state.setPhase);
  const setRound = useGameStore((state: any) => state.setRound);
  const raisedForVoting = useGameStore((state: any) => state.raisedForVoting);
  const clearRaisedForVoting = useGameStore(
    (state: any) => state.clearRaisedForVoting,
  );
  const selectedGameRoles = useGameStore(
    (state: any) => state.selectedGameRoles,
  );
  const [voteModeVoterId, setVoteModeVoterId] = useState<number | null>(null);

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

  const intervalRef = useRef<number | null>(null);
  const timerSecondsRef = useRef<number>(dayTimerSecondsLeft);

  useEffect(() => {
    resetDayTimer();
  }, []);

  useEffect(() => {
    timerSecondsRef.current = dayTimerSecondsLeft;
  }, [dayTimerSecondsLeft]);

  useEffect(() => {
    if (!isDayTimerRunning) return;

    intervalRef.current = window.setInterval(() => {
      const current = Number.isFinite(timerSecondsRef.current)
        ? timerSecondsRef.current
        : speechTimer;
      if (current <= 1) {
        window.clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDayTimerRunning(false);
        setDayTimerSecondsLeft(0);
        timerSecondsRef.current = 0;
        return;
      }
      const next = current - 1;
      timerSecondsRef.current = next;
      setDayTimerSecondsLeft(next);
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const displayedPlayers = useMemo(
    () =>
      [...players]
        .filter((player: any) => player.isAlive)
        .sort((a: any, b: any) => a.tableOrder - b.tableOrder),
    [players],
  );

  const assignedRoleCounts = useMemo(() => {
    return players.reduce((acc: Record<string, number>, player: any) => {
      acc[player.role] = (acc[player.role] ?? 0) + 1;
      return acc;
    }, {});
  }, [players]);

  const roleAssignmentComplete = useMemo(() => {
    return Object.entries(selectedGameRoles).every(([role, requiredCount]) => {
      if (role === "Citizen") return true;
      const required = Number(requiredCount ?? 0);
      if (required <= 0) return true;
      return (assignedRoleCounts[role] ?? 0) >= required;
    });
  }, [assignedRoleCounts, selectedGameRoles]);

  const switchToNextPhase = () => {
    if (phase === "night acquaintance") {
      setPhase("day acquaintance");
      return;
    }

    if (phase === "day acquaintance" && raisedForVotingPlayers.length > 1) {
      setPhase("voting");
      navigate("/voting");
    } else if (
      phase === "day acquaintance" &&
      (raisedForVotingPlayers.length === 0 ||
        raisedForVotingPlayers.length === 1)
    ) {
      clearRaisedForVoting();
      setPhase("night");
      setRound(1);
      navigate("/night?round=1");
    }
  };

  const handleVoteTargetSelect = (targetId: number) => {
    if (voteModeVoterId === null) return;
    raisedForVoting(targetId);
    setVoteModeVoterId(null);
  };

  const buttonTextToDisplay =
    phase === "night acquaintance"
      ? roleAssignmentComplete
        ? "Continue to day acquaintance"
        : "Assign all roles first"
      : phase === "day acquaintance" && raisedForVotingPlayers.length > 1
        ? `Open voting stage (${raisedForVotingPlayers.length})`
        : "Move to night";

  const phaseLabel =
    phase === "night acquaintance"
      ? "Night acquaintance — initial setup"
      : phase === "day acquaintance"
        ? "Day acquaintance"
        : phase;

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box>
            <SectionTitle>{phaseLabel}</SectionTitle>
            <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
              Review each player and prepare the next stage smoothly.
            </Typography>
          </Box>
          {phase === "day acquaintance" && (
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
                minWidth: 220,
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
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "1.35rem" }}
                >
                  {formatTime(
                    Number.isFinite(dayTimerSecondsLeft)
                      ? dayTimerSecondsLeft
                      : speechTimer,
                  )}
                </Typography>
                <Box>
                  <IconButton
                    onClick={() =>
                      isDayTimerRunning
                        ? setDayTimerRunning(false)
                        : setDayTimerRunning(true)
                    }
                  >
                    <PlayCircleFilledIcon />
                  </IconButton>
                  <IconButton onClick={resetDayTimer}>
                    <RestartAltIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
          <SectionChip>{displayedPlayers.length} players</SectionChip>
        </TopBar>

        <PlayerCardsWrapper>
          {displayedPlayers.map((player: any) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              nickname={player.nickname}
              role={player.role}
              tableOrder={player.tableOrder}
              voteModeVoterId={voteModeVoterId}
              onStartVoteMode={setVoteModeVoterId}
              onVoteTargetSelect={handleVoteTargetSelect}
            />
          ))}
        </PlayerCardsWrapper>
      </ContentShell>

      <GoToDayAcquaintanceButton
        onClick={switchToNextPhase}
        disabled={phase === "night acquaintance" && !roleAssignmentComplete}
      >
        {buttonTextToDisplay}
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
