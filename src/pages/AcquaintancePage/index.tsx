import { Box, Typography } from "@mui/material";
import { useMemo, useState, useRef, useEffect } from "react";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  NightActionButton,
  NightActionsWrapper,
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
import { CountdownTimer } from "../../components/CountdownTimer";

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
  const addFoul = useGameStore((state: any) => state.addFoul);
  const selectedGameRoles = useGameStore(
    (state: any) => state.selectedGameRoles,
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [foulFeedback, setFoulFeedback] = useState<string | null>(null);
  const [foulWasGivenForSelection, setFoulWasGivenForSelection] =
    useState(false);
  const foulWasGivenForSelectionRef = useRef(false);
  const [nominationWasGivenForSelection, setNominationWasGivenForSelection] =
    useState(false);
  const nominationWasGivenForSelectionRef = useRef(false);

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

  useEffect(() => {
    resetDayTimer();
  }, []);

  useEffect(() => {
    setSelectedPlayerId(null);
    foulWasGivenForSelectionRef.current = false;
    setFoulWasGivenForSelection(false);
    nominationWasGivenForSelectionRef.current = false;
    setNominationWasGivenForSelection(false);
  }, [phase]);

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

  const selectedPlayer = displayedPlayers.find(
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
            <CountdownTimer
              label="Speaker time"
              secondsLeft={dayTimerSecondsLeft}
              totalSeconds={speechTimer}
              running={isDayTimerRunning}
              onSecondsChange={setDayTimerSecondsLeft}
              onRunningChange={setDayTimerRunning}
              onReset={resetDayTimer}
            />
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
              selectedForDay={player.id === selectedPlayerId}
              onDayPlayerSelect={handleSelectPlayer}
            />
          ))}
        </PlayerCardsWrapper>
      </ContentShell>

      {phase === "day acquaintance" && (
        <NightActionsWrapper>
          <NightActionButton
            onClick={handleGiveFoul}
            disabled={!selectedPlayer || foulWasGivenForSelection}
            sx={{ background: "rgba(56,189,248,0.92)", minWidth: 170 }}
          >
            Give foul +1
          </NightActionButton>

          <NightActionButton
            onClick={handleNominatePlayer}
            disabled={
              !selectedPlayer ||
              nominationWasGivenForSelection ||
              selectedPlayerAlreadyRaised
            }
            sx={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",
              minWidth: 190,
            }}
          >
            Nominate player
          </NightActionButton>
        </NightActionsWrapper>
      )}

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

      <GoToDayAcquaintanceButton
        onClick={switchToNextPhase}
        disabled={phase === "night acquaintance" && !roleAssignmentComplete}
      >
        {buttonTextToDisplay}
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
