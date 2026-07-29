import { Box, Typography } from "@mui/material";
import { useMemo, useState } from "react";
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
        ? "Day acquaintance — initial setup"
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
