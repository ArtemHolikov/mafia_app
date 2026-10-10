import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import {
  ContentShell,
  GoToDayAcquaintanceButton,
  PageWrapper,
  PlayerCardsWrapper,
  SectionTitle,
  TopBar,
  NightActionsWrapper,
} from "../AcquaintancePage/index.styles";
import backgroundImage from "../../images/backgroundPhoto.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";

type NightAction =
  | "mafia"
  | "thief"
  | "maniac"
  | "doctor"
  | "sheriff"
  | "journalist"
  | "don";

type NightPlayer = {
  id: number;
  nickname: string;
  tableOrder: number;
  role: string;
  isAlive: boolean;
};

type InformationResult =
  | { action: "sheriff" | "don"; target: NightPlayer; positive: boolean }
  | {
      action: "journalist";
      firstTarget: NightPlayer;
      secondTarget: NightPlayer;
      sameTeam: boolean;
    };

const NIGHT_STEPS: { id: NightAction; title: string; role: string }[] = [
  { id: "mafia", title: "Mafia", role: "Mafia" },
  { id: "thief", title: "Thief", role: "Thief" },
  { id: "maniac", title: "Maniac", role: "Maniac" },
  { id: "doctor", title: "Doctor", role: "Doctor" },
  { id: "sheriff", title: "Sheriff", role: "Sheriff" },
  { id: "journalist", title: "Journalist", role: "Journalist" },
  { id: "don", title: "Don", role: "Don" },
];

const MAFIA_ROLES = new Set(["Don", "Mafia", "Thief"]);

const hasLivingActor = (action: NightAction, roster: any[]) => {
  if (action === "mafia") {
    return roster.some(
      (player: any) => player.isAlive && ["Don", "Mafia"].includes(player.role),
    );
  }

  const step = NIGHT_STEPS.find((candidate) => candidate.id === action);
  return Boolean(
    step &&
    roster.some((player: any) => player.isAlive && player.role === step.role),
  );
};

const isActionBlocked = (action: NightAction, roster: any[]) => {
  if (action === "mafia" || action === "thief") return false;
  const step = NIGHT_STEPS.find((candidate) => candidate.id === action);
  return Boolean(
    step &&
    roster.some(
      (player: any) =>
        player.isAlive && player.role === step.role && player.pendingThiefBlock,
    ),
  );
};

const findNextAvailableStep = (startIndex: number, roster: any[]) => {
  let index = startIndex;
  while (index < NIGHT_STEPS.length) {
    const action = NIGHT_STEPS[index].id;
    if (hasLivingActor(action, roster) && !isActionBlocked(action, roster)) {
      break;
    }
    index += 1;
  }
  return index;
};

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
  const alivePlayers = players.filter((player: any) => player.isAlive);
  const aliveCount = alivePlayers.length;
  const roundParam = Number(searchParams.get("round") ?? round) || 1;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState<NightAction[]>([]);
  const [journalistFirstTargetId, setJournalistFirstTargetId] = useState<
    number | null
  >(null);
  const [informationResult, setInformationResult] =
    useState<InformationResult | null>(null);

  const filteredPlayers = alivePlayers;

  const activeAction = NIGHT_STEPS[currentStepIndex]?.id ?? null;

  useEffect(() => {
    if (roundParam !== round) setRound(roundParam);
    setPhase("night");
    setCurrentStepIndex(
      findNextAvailableStep(0, useGameStore.getState().players),
    );
    setCompletedActions([]);
    setJournalistFirstTargetId(null);
    setInformationResult(null);
  }, [roundParam, setRound, setPhase]);

  const goToDay = () => {
    if (currentStepIndex < NIGHT_STEPS.length) return;
    setPhase("day");
    navigate(`/day?round=${roundParam}`);
  };

  const completeCurrentAction = (action: NightAction) => {
    setCompletedActions((previous) => [...previous, action]);
    setJournalistFirstTargetId(null);
    setCurrentStepIndex(
      findNextAvailableStep(
        currentStepIndex + 1,
        useGameStore.getState().players,
      ),
    );
  };

  const handlePlayerClick = (playerId: number) => {
    if (!activeAction) return;
    const target = alivePlayers.find((player: any) => player.id === playerId);
    if (!target) return;

    if (activeAction === "mafia") {
      setMafiaNightTarget(playerId);
      completeCurrentAction("mafia");
      return;
    }

    if (activeAction === "thief") {
      setThiefNightTarget(playerId);
      completeCurrentAction("thief");
      return;
    }

    if (activeAction === "maniac") {
      setManiacNightTarget(playerId);
      completeCurrentAction("maniac");
      return;
    }

    if (activeAction === "doctor") {
      doctorHealTarget(playerId, roundParam);
      completeCurrentAction("doctor");
      return;
    }

    if (activeAction === "sheriff") {
      setInformationResult({
        action: "sheriff",
        target,
        positive: MAFIA_ROLES.has(target.role),
      });
      completeCurrentAction("sheriff");
      return;
    }

    if (activeAction === "journalist") {
      if (journalistFirstTargetId === null) {
        setJournalistFirstTargetId(playerId);
        return;
      }
      if (journalistFirstTargetId === playerId) return;

      const firstTarget = alivePlayers.find(
        (player: any) => player.id === journalistFirstTargetId,
      );
      if (!firstTarget) return;

      setInformationResult({
        action: "journalist",
        firstTarget,
        secondTarget: target,
        sameTeam:
          MAFIA_ROLES.has(firstTarget.role) === MAFIA_ROLES.has(target.role),
      });
      completeCurrentAction("journalist");
      return;
    }

    if (activeAction === "don") {
      setInformationResult({
        action: "don",
        target,
        positive: target.role === "Sheriff",
      });
      completeCurrentAction("don");
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
    if (["sheriff", "journalist", "don"].includes(last)) {
      setInformationResult(null);
    }
    setCompletedActions((prev) => prev.slice(0, -1));
    setCurrentStepIndex(NIGHT_STEPS.findIndex((step) => step.id === last));
    setJournalistFirstTargetId(null);
  };

  const activeStep = NIGHT_STEPS[currentStepIndex];
  const activeButtonText = activeStep
    ? activeStep.id === "journalist"
      ? `Select ${journalistFirstTargetId === null ? "the first" : "the second"} player for the Journalist`
      : `Select a player for the ${activeStep.title}`
    : "All night actions are complete";

  return (
    <PageWrapper bgimage={backgroundImage}>
      <ContentShell>
        <TopBar>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
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
                "@media (max-width: 600px)": {
                  width: "100%",
                  minWidth: 0,
                  padding: "12px 16px",
                },
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

      <Box
        component="nav"
        aria-label="Night action order"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
          gap: 1,
          maxWidth: 1400,
          mx: "auto",
          mb: 2,
        }}
      >
        {NIGHT_STEPS.map((step, index) => {
          const isDone = completedActions.includes(step.id);
          const hasActor = hasLivingActor(step.id, players);
          const isBlocked = isActionBlocked(step.id, players);
          const isCurrent = index === currentStepIndex;
          const status = isDone
            ? "Done"
            : !hasActor
              ? "No living role"
              : isBlocked
                ? "Blocked"
                : isCurrent
                  ? "Current"
                  : index < currentStepIndex
                    ? "Skipped"
                    : "Next";
          const statusColor = isDone
            ? "#86efac"
            : isCurrent
              ? "#7dd3fc"
              : isBlocked
                ? "#fcd34d"
                : "rgba(248,250,252,0.5)";

          return (
            <Box
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              sx={{
                minWidth: 0,
                p: 1.25,
                borderRadius: 1.5,
                border: `1px solid ${isCurrent ? "rgba(56,189,248,0.65)" : "rgba(255,255,255,0.1)"}`,
                bgcolor: isCurrent
                  ? "rgba(14,165,233,0.16)"
                  : isDone
                    ? "rgba(34,197,94,0.07)"
                    : "rgba(15,23,42,0.55)",
                boxShadow: isCurrent
                  ? "0 0 18px rgba(56,189,248,0.14)"
                  : "none",
                opacity: !hasActor || isBlocked ? 0.68 : 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(248,250,252,0.52)",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography
                  sx={{
                    color: statusColor,
                    fontSize: "0.68rem",
                    fontWeight: 750,
                    textAlign: "right",
                  }}
                >
                  {status}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "#f8fafc",
                  fontSize: "0.86rem",
                  fontWeight: 750,
                  mt: 0.6,
                }}
              >
                {step.title}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <PlayerCardsWrapper>
        {filteredPlayers.map((player: any) => (
          <PlayerCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            tableOrder={player.tableOrder}
            role={player.role}
            nightAction={activeAction}
            selectedForNightTarget={player.id === journalistFirstTargetId}
            onNightTargetSelect={handlePlayerClick}
          />
        ))}
      </PlayerCardsWrapper>

      <NightActionsWrapper>
        {completedActions.length > 0 && (
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
            startIcon={<UndoRoundedIcon />}
          >
            Undo{" "}
            {
              NIGHT_STEPS.find(
                (step) =>
                  step.id === completedActions[completedActions.length - 1],
              )?.title
            }
          </Button>
        )}
      </NightActionsWrapper>

      <GoToDayAcquaintanceButton
        onClick={goToDay}
        disabled={currentStepIndex < NIGHT_STEPS.length}
        sx={{
          "&.Mui-disabled": {
            color: "rgba(255,255,255,0.55)",
            background: "rgba(71,85,105,0.75)",
            boxShadow: "none",
          },
        }}
      >
        Proceed to day
      </GoToDayAcquaintanceButton>

      <Dialog
        open={Boolean(informationResult)}
        onClose={() => setInformationResult(null)}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-paper": {
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "radial-gradient(ellipse at top left, rgba(56,189,248,0.14), transparent 60%), linear-gradient(145deg, #111827, #090e19)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#f8fafc", textAlign: "center", pt: 3 }}>
          {informationResult?.action === "sheriff"
            ? "Sheriff's check"
            : informationResult?.action === "don"
              ? "Don's check"
              : "Journalist's comparison"}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 3, pb: 2 }}>
          {informationResult?.action === "journalist" ? (
            <>
              <Typography sx={{ color: "rgba(248,250,252,0.68)", mb: 2 }}>
                {informationResult.firstTarget.nickname} and{" "}
                {informationResult.secondTarget.nickname}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  gap: 1,
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${informationResult.sameTeam ? "rgba(74,222,128,0.28)" : "rgba(251,113,133,0.28)"}`,
                  bgcolor: informationResult.sameTeam
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(244,63,94,0.08)",
                }}
              >
                {informationResult.sameTeam ? (
                  <ThumbUpAltRoundedIcon
                    sx={{ color: "#4ade80", fontSize: 34 }}
                  />
                ) : (
                  <ThumbDownAltRoundedIcon
                    sx={{ color: "#fb7185", fontSize: 34 }}
                  />
                )}
                <Typography
                  sx={{
                    color: "#f8fafc",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                  }}
                >
                  {informationResult.sameTeam ? "Same team" : "Different teams"}
                </Typography>
                <Typography
                  sx={{ color: "rgba(248,250,252,0.65)", fontSize: "0.88rem" }}
                >
                  {informationResult.sameTeam
                    ? "Both players are Mafia, or both are Town."
                    : "One player is Mafia and the other is Town."}
                </Typography>
              </Box>
            </>
          ) : informationResult ? (
            <>
              <Typography sx={{ color: "rgba(248,250,252,0.68)", mb: 2 }}>
                {informationResult.target.nickname}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  gap: 1,
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${informationResult.positive ? "rgba(251,113,133,0.28)" : "rgba(74,222,128,0.28)"}`,
                  bgcolor: informationResult.positive
                    ? "rgba(244,63,94,0.08)"
                    : "rgba(34,197,94,0.08)",
                }}
              >
                {informationResult.positive ? (
                  <CheckCircleRoundedIcon
                    sx={{ color: "#fb7185", fontSize: 34 }}
                  />
                ) : (
                  <CloseRoundedIcon sx={{ color: "#4ade80", fontSize: 34 }} />
                )}
                <Typography
                  sx={{
                    color: "#f8fafc",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                  }}
                >
                  {informationResult.action === "sheriff"
                    ? informationResult.positive
                      ? "Mafia"
                      : "Not Mafia"
                    : informationResult.positive
                      ? "Sheriff"
                      : "Not Sheriff"}
                </Typography>
              </Box>
            </>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setInformationResult(null)}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 1.5, py: 1.1 }}
          >
            Continue night
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
};
