import { Box, Button, Typography } from "@mui/material";
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
  const clearMafiaNightTarget = useGameStore(
    (state: any) => state.clearMafiaNightTarget,
  );
  const clearManiacNightTarget = useGameStore(
    (state: any) => state.clearManiacNightTarget,
  );
  const clearThiefNightTarget = useGameStore(
    (state: any) => state.clearThiefNightTarget,
  );
  const clearDoctorHeal = useGameStore((state: any) => state.clearDoctorHeal);
  const doctorHealTarget = useGameStore((state: any) => state.doctorHealTarget);
  const commitNightDeaths = useGameStore(
    (state: any) => state.commitNightDeaths,
  );

  const alivePlayers = players.filter((player: any) => player.isAlive);
  const aliveCount = alivePlayers.length;
  const roundParam = Number(searchParams.get("round") ?? round) || 1;
  const [activeAction, setActiveAction] = useState<
    "mafia" | "maniac" | "doctor" | "thief" | null
  >(null);
  const [completedActions, setCompletedActions] = useState<
    ("mafia" | "maniac" | "doctor" | "thief")[]
  >([]);

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
      setCompletedActions((prev) => [...prev, "mafia"]);
      setActiveAction(null);
      return;
    }

    if (activeAction === "maniac") {
      setManiacNightTarget(playerId);
      setCompletedActions((prev) => [...prev, "maniac"]);
      setActiveAction(null);
      return;
    }

    if (activeAction === "doctor") {
      doctorHealTarget(playerId, roundParam);
      setCompletedActions((prev) => [...prev, "doctor"]);
      setActiveAction(null);
      return;
    }

    if (activeAction === "thief") {
      setThiefNightTarget(playerId);
      setCompletedActions((prev) => [...prev, "thief"]);
      setActiveAction(null);
      return;
    }
  };

  const handleUndoLastAction = () => {
    const last = completedActions[completedActions.length - 1];
    if (!last) return;
    if (last === "mafia") clearMafiaNightTarget();
    if (last === "maniac") clearManiacNightTarget();
    if (last === "thief") clearThiefNightTarget();
    if (last === "doctor") clearDoctorHeal();
    setCompletedActions((prev) => prev.slice(0, -1));
  };

  const activeButtonText = activeAction
    ? `Select a player for ${activeAction}`
    : "Choose a night action";

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
              <SectionTitle>{`Night — round ${roundParam}`}</SectionTitle>
              <Typography sx={{ color: "rgba(248,250,252,0.8)", marginTop: 1 }}>
                {activeButtonText}. Proceed to the next day when ready.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.18)",
                bgcolor: "rgba(255,255,255,0.04)",
                minWidth: 120,
                padding: "15px 40px",
                alignItems: "center",
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
                Alive players
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  mt: 0.5,
                }}
              >
                {aliveCount}
              </Typography>
            </Box>
          </Box>
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
        {completedActions.length > 0 && activeAction === null && (
          <Button
            onClick={handleUndoLastAction}
            variant="outlined"
            sx={{
              borderRadius: 999,
              borderColor: "rgba(255,255,255,0.3)",
              color: "rgba(248,250,252,0.8)",
              px: 3,
              py: 1.5,
              fontWeight: 600,
              "&:hover": { borderColor: "#fff" },
            }}
          >
            Undo {completedActions[completedActions.length - 1]}
          </Button>
        )}
      </NightActionsWrapper>

      <GoToDayAcquaintanceButton onClick={goToDay}>
        Proceed to day
      </GoToDayAcquaintanceButton>
    </PageWrapper>
  );
};
