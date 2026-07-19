import { Box, Typography } from "@mui/material";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionTitle,
  TopBar,
  NightActionsWrapper,
  NightActionButton,
} from "../AcquaintancePage/index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";

export const NightPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setPhase = useGameStore((state: any) => state.setPhase);
  const round = useGameStore((state: any) => state.round);
  const setRound = useGameStore((state: any) => state.setRound);
  const players = useGameStore((state: any) => state.players);
  const setMafiaNightTarget = useGameStore(
    (state: any) => state.setMafiaNightTarget,
  );
  const setManiacNightTarget = useGameStore(
    (state: any) => state.setManiacNightTarget,
  );
  const setThiefNightTarget = useGameStore(
    (state: any) => state.setThiefNightTarget,
  );
  const doctorHealTarget = useGameStore((state: any) => state.doctorHealTarget);
  const commitNightDeaths = useGameStore(
    (state: any) => state.commitNightDeaths,
  );

  const alivePlayers = players.filter((player: any) => player.isAlive);
  const roundParam = Number(searchParams.get("round") ?? round) || 1;
  const [activeAction, setActiveAction] = useState<
    "mafia" | "maniac" | "doctor" | "thief" | null
  >(null);

  const hasRole = useMemo(
    () => (role: string) => players.some((player: any) => player.role === role),
    [players],
  );

  const blockedRoles = useMemo(
    () =>
      new Set(
        players
          .filter(
            (player: any) =>
              player.pendingThiefBlock &&
              ["Maniac", "Doctor", "Sheriff"].includes(player.role),
          )
          .map((player: any) => player.role),
      ),
    [players],
  );

  const filteredPlayers = alivePlayers;

  useEffect(() => {
    if (roundParam !== round) {
      setRound(roundParam);
    }
    setPhase("night");
  }, [round, roundParam, setRound, setPhase]);

  const goToDay = () => {
    setPhase("day");
    navigate(`/day?round=${roundParam}`);
  };

  const handlePlayerClick = (playerId: number) => {
    if (!activeAction) return;

    if (activeAction === "mafia") {
      setMafiaNightTarget(playerId);
      setActiveAction(null);
      return;
    }

    if (activeAction === "maniac") {
      setManiacNightTarget(playerId);
      setActiveAction(null);
      return;
    }

    if (activeAction === "doctor") {
      doctorHealTarget(playerId, roundParam);
      setActiveAction(null);
      return;
    }

    if (activeAction === "thief") {
      setThiefNightTarget(playerId);
      setActiveAction(null);
      return;
    }
  };

  const activeButtonText = activeAction
    ? `Select a player for ${activeAction}`
    : "Choose a night action";

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box>
            <SectionTitle>{`Night — round ${roundParam}`}</SectionTitle>
            <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
              {activeButtonText}. Proceed to the next day when ready.
            </Typography>
          </Box>
          <Typography sx={{ color: "rgba(248,250,252,0.8)" }}>
            Round {roundParam}
          </Typography>
        </TopBar>
      </ContentShell>

      <PlayerCardsWrapper>
        {filteredPlayers.map((player: any) => (
          <PlayerCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            tableOrder={player.tableOrder}
            role={player.role}
            nightAction={activeAction}
            onNightTargetSelect={handlePlayerClick}
          />
        ))}
      </PlayerCardsWrapper>

      <NightActionsWrapper>
        <NightActionButton
          onClick={() => setActiveAction("mafia")}
          disabled={activeAction !== null}
        >
          Mafia's turn
        </NightActionButton>
        {hasRole("Maniac") && (
          <NightActionButton
            onClick={() => setActiveAction("maniac")}
            disabled={activeAction !== null || blockedRoles.has("Maniac")}
          >
            Maniac's turn
          </NightActionButton>
        )}
        {hasRole("Doctor") && (
          <NightActionButton
            onClick={() => setActiveAction("doctor")}
            disabled={activeAction !== null || blockedRoles.has("Doctor")}
          >
            Doctor's turn
          </NightActionButton>
        )}
        {hasRole("Thief") && (
          <NightActionButton
            onClick={() => setActiveAction("thief")}
            disabled={activeAction !== null}
          >
            Thief's turn
          </NightActionButton>
        )}
      </NightActionsWrapper>

      <GoToDayAcquaintanceButton onClick={goToDay}>
        Proceed to day
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
