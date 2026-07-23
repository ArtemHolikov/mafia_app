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
  GoToDayAcquaintanceButton,
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
  const [voteModeVoterId, setVoteModeVoterId] = useState<number | null>(null);
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
  const townAliveCount = aliveCount - mafiaAliveCount;
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

    resetDayTimer();

    if (killedPlayers.length > 0) {
      setShowKilledDialog(true);
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

  const raisedForVoting = useGameStore((state: any) => state.raisedForVoting);
  const raisedForVotingPlayers = useGameStore(
    (state: any) => state.raisedForVotingPlayers,
  );

  const handleVoteTargetSelect = (targetId: number) => {
    if (voteModeVoterId === null) return;
    raisedForVoting(targetId);
    setVoteModeVoterId(null);
  };

  const goToNight = () => {
    // If there are players raised for voting, move to voting stage instead
    if (raisedForVotingPlayers.length > 0) {
      setPhase("voting");
      navigate("/voting");
      return;
    }

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
            voteModeVoterId={voteModeVoterId}
            onStartVoteMode={setVoteModeVoterId}
            onVoteTargetSelect={handleVoteTargetSelect}
          />
        ))}
      </PlayerCardsWrapper>

      <GoToDayAcquaintanceButton onClick={goToNight}>
        {raisedForVotingPlayers.length > 0
          ? `Voting Phase (${raisedForVotingPlayers.length})`
          : "Proceed to night"}
      </GoToDayAcquaintanceButton>

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
    </PageWrapper>
  );
};
