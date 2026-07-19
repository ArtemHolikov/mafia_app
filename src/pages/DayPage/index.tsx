import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { PlayerCard } from "../AcquaintancePage/components/PlayerCard";

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
  const [showKilledDialog, setShowKilledDialog] = useState(false);
  const alivePlayers = useMemo(
    () => players.filter((player: any) => player.isAlive),
    [players],
  );
  const aliveCount = alivePlayers.length;
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

    if (killedPlayers.length > 0) {
      setShowKilledDialog(true);
    }
  }, [round, roundParam, setRound, setPhase, killedPlayers.length]);

  const confirmKills = () => {
    if (killedPlayers.length > 0) {
      commitNightDeaths();
    }
    setShowKilledDialog(false);
  };

  const goToNight = () => {
    const nextNightRound = roundParam + 1;
    setPhase("night");
    setRound(nextNightRound);
    navigate(`/night?round=${nextNightRound}`);
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
        {alivePlayers.map((player: any) => (
          <PlayerCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            tableOrder={player.tableOrder}
            role={player.role}
          />
        ))}
      </PlayerCardsWrapper>

      <GoToDayAcquaintanceButton onClick={goToNight}>
        Proceed to night
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
