import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

type GameOverPlayer = {
  id: number;
  nickname: string;
  role: string;
  tableOrder?: number;
  isAlive: boolean;
};

interface GameOverDialogProps {
  open: boolean;
  winner: "Town" | "Mafia";
  message: string;
  players: GameOverPlayer[];
  onClose: () => void;
  onReturnToLobby: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  Don: "#fb7185",
  Mafia: "#fb923c",
  Thief: "#c084fc",
  Sheriff: "#60a5fa",
  Doctor: "#4ade80",
  Journalist: "#fbbf24",
  Maniac: "#f472b6",
};

export const GameOverDialog = ({
  open,
  winner,
  message,
  players,
  onClose,
  onReturnToLobby,
}: GameOverDialogProps) => {
  const accent = winner === "Town" ? "#4ade80" : "#fb7185";
  const orderedPlayers = players
    .filter((player: GameOverPlayer) => player.role !== "Citizen")
    .sort(
      (first: GameOverPlayer, second: GameOverPlayer) =>
        (first.tableOrder ?? first.id) - (second.tableOrder ?? second.id),
    );
  const mafiaRoles = new Set(["Don", "Mafia", "Thief"]);
  const playerGroups = [
    {
      title: "Mafia roles",
      color: "#fb7185",
      players: orderedPlayers.filter((player) => mafiaRoles.has(player.role)),
    },
    {
      title: "Other roles",
      color: "#4ade80",
      players: orderedPlayers.filter((player) => !mafiaRoles.has(player.role)),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="game-over-title"
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: "90vh",
          overflow: "hidden",
          border: `1px solid ${accent}40`,
          background: `radial-gradient(ellipse at top left, ${accent}20, transparent 58%), linear-gradient(145deg, #111827, #090e19)`,
        },
      }}
    >
      <DialogTitle
        id="game-over-title"
        sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, pt: 3 }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            flex: "0 0 auto",
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            color: accent,
            bgcolor: `${accent}18`,
            border: `1px solid ${accent}40`,
          }}
        >
          <EmojiEventsRoundedIcon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: accent,
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Game over
          </Typography>
          <Typography
            component="div"
            sx={{ color: "#f8fafc", fontSize: "1.4rem", fontWeight: 800 }}
          >
            {winner} wins
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
        <Typography sx={{ color: "rgba(248,250,252,0.7)", mb: 2 }}>
          {message}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            pb: 1,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography sx={{ color: "#f8fafc", fontWeight: 750 }}>
            Final roster
          </Typography>
          <Typography
            sx={{ color: "rgba(248,250,252,0.55)", fontSize: "0.8rem" }}
          >
            {orderedPlayers.length} players
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 0.75,
            maxHeight: "min(42vh, 360px)",
            overflowY: "auto",
            pt: 1,
            pr: 0.5,
          }}
        >
          {playerGroups.map((group) => (
            <Box key={group.title} sx={{ display: "grid", gap: 0.75 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  px: 0.5,
                  pt: 1,
                  pb: 0.25,
                }}
              >
                <Typography
                  sx={{
                    color: group.color,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                  }}
                >
                  {group.title}
                </Typography>
                <Typography
                  sx={{ color: "rgba(248,250,252,0.48)", fontSize: "0.75rem" }}
                >
                  {group.players.length}
                </Typography>
              </Box>
              {group.players.length > 0 ? (
                group.players.map((player: GameOverPlayer, index: number) => {
                  const roleColor = ROLE_COLORS[player.role] ?? "#cbd5e1";

                  return (
                    <Box
                      key={player.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "38px minmax(0, 1fr) auto",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                        px: 1.25,
                        py: 1,
                        borderRadius: 1.5,
                        border: "1px solid rgba(255,255,255,0.07)",
                        bgcolor: player.isAlive
                          ? "rgba(255,255,255,0.035)"
                          : "rgba(255,255,255,0.018)",
                        opacity: player.isAlive ? 1 : 0.66,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 1.25,
                          bgcolor: "rgba(255,255,255,0.06)",
                          color: "rgba(248,250,252,0.75)",
                          fontSize: "0.76rem",
                          fontWeight: 800,
                        }}
                      >
                        {String(player.tableOrder ?? index + 1).padStart(
                          2,
                          "0",
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#f8fafc",
                            fontWeight: 700,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {player.nickname}
                        </Typography>
                        <Typography
                          sx={{
                            color: roleColor,
                            fontSize: "0.8rem",
                            fontWeight: 650,
                          }}
                        >
                          {player.role}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          color: player.isAlive ? "#86efac" : "#fda4af",
                          fontSize: "0.72rem",
                          fontWeight: 750,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {player.isAlive ? "Alive" : "Eliminated"}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography
                  sx={{
                    px: 1.25,
                    py: 1,
                    color: "rgba(248,250,252,0.42)",
                    fontSize: "0.82rem",
                  }}
                >
                  No players in this group
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={onReturnToLobby}
          variant="contained"
          startIcon={<ReplayRoundedIcon />}
          sx={{
            width: "100%",
            py: 1.15,
            borderRadius: 1.5,
            bgcolor: accent,
            color: "#0b1120",
            "&:hover": { bgcolor: winner === "Town" ? "#22c55e" : "#f43f5e" },
          }}
        >
          Back to lobby settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};
