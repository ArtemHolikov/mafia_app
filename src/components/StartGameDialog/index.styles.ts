import {
  Box,
  Button,
  MenuItem,
  MenuList,
  styled,
  Typography,
} from "@mui/material";

export const StartGameDialogBody = styled(Box)({
  width: "100%",
  maxWidth: 820,
  maxHeight: "min(90vh, 900px)",
  overflowY: "auto",
  padding: "clamp(18px, 3vw, 30px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(ellipse at top left, rgba(8,145,178,0.14), transparent 46%), linear-gradient(145deg, #0e1b2a, #07111d 72%)",
  border: "1px solid rgba(103,232,249,0.22)",
  boxShadow: "0 30px 90px rgba(2,6,23,0.72), 0 0 38px rgba(34,211,238,0.08)",
  scrollbarColor: "rgba(103,232,249,0.35) transparent",
  scrollbarWidth: "thin",
  "& .MuiOutlinedInput-root": {
    color: "#f8fafc",
    background: "rgba(4,14,25,0.72)",
    borderRadius: 10,
    "& fieldset": { borderColor: "rgba(148,211,225,0.2)" },
    "&:hover fieldset": { borderColor: "rgba(103,232,249,0.5)" },
    "&.Mui-focused fieldset": {
      borderColor: "#22d3ee",
      boxShadow: "0 0 0 3px rgba(34,211,238,0.1)",
    },
  },
  "& .MuiInputLabel-root": { color: "rgba(207,250,254,0.62)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#67e8f9" },
  "@supports (height: 100dvh)": {
    maxHeight: "calc(100dvh - 16px)",
  },
});

export const SettingsLobbyTitle = styled(Typography)({
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "#cffafe",
  padding: "4px 0 12px",
  textShadow: "0 0 18px rgba(34,211,238,0.16)",
});

export const PlayersBox = styled(Box)({
  paddingTop: 8,
});

export const PlayersList = styled(MenuList)({
  marginTop: 16,
  overflowY: "auto",
  maxHeight: "250px",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  scrollbarColor: "grey transparent",
  scrollbarWidth: "thin",
  gap: 8,
  minWidth: 0,
});

export const PlayerItem = styled(MenuItem)({
  borderRadius: 10,
  padding: "10px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(9,25,38,0.8)",
  border: "1px solid rgba(103,232,249,0.12)",
  transition: "border-color 160ms ease, background 160ms ease",
  minWidth: 0,
  "&:hover": {
    background: "rgba(8,47,60,0.52)",
    borderColor: "rgba(103,232,249,0.38)",
  },
  "@media (max-width: 480px)": {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 8,
    "& > *": {
      width: "100%",
      minWidth: 0,
    },
    "& > :last-child": {
      justifyContent: "flex-end",
    },
  },
});

export const PlayerItemInfoText = styled(Typography)({
  color: "#f8fafc",
  fontWeight: 600,
  fontSize: "0.95rem",
  overflowWrap: "anywhere",
});

export const NoPlayersMessage = styled(Typography)({
  fontSize: "1rem",
  color: "rgba(248,250,252,0.7)",
  textAlign: "center",
  padding: "24px 0",
});

export const GoToAcquaintancePhase = styled(Button)({
  background: "linear-gradient(110deg, #06b6d4, #10b981)",
  color: "#04121b",
  width: "100%",
  marginTop: 26,
  padding: "13px 16px",
  borderRadius: 10,
  fontWeight: 800,
  boxShadow: "0 0 22px rgba(34,211,238,0.16)",
  "&:hover": {
    background: "linear-gradient(110deg, #22d3ee, #34d399)",
    boxShadow: "0 0 28px rgba(34,211,238,0.28)",
  },
});

export const TabPanelBox = styled(Box)(({ theme }) => ({
  marginTop: 16,
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const TotalCountChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(34, 211, 238, 0.08)",
  color: "#a5f3fc",
  border: "1px solid rgba(103, 232, 249, 0.22)",
  borderRadius: 8,
  padding: "7px 12px",
  fontWeight: 700,
  fontSize: "0.95rem",
}));

export const RoleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 0",
  borderBottom: "1px solid rgba(103,232,249,0.1)",
  "@media (max-width: 480px)": {
    gap: 6,
    padding: "10px 0",
  },
}));

export const RoleInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
}));

export const RoleCountField = styled(Box)(({ theme }) => ({
  minWidth: 110,
  display: "flex",
  alignItems: "center",
  gap: 8,
  "@media (max-width: 480px)": {
    minWidth: 0,
    gap: 6,
  },
}));

export const RoleToggleField = styled(Box)(({ theme }) => ({
  minWidth: 140,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  "@media (max-width: 480px)": {
    minWidth: 0,
  },
}));

export const ImmunityButton = styled(Button)(({ theme }) => ({
  width: "100%",
  borderRadius: 10,
  padding: "14px 0",
  background: "rgba(34,211,238,0.07)",
  color: "#a5f3fc",
  fontWeight: 700,
  border: "1px dashed rgba(103,232,249,0.3)",
  "&:hover": {
    background: "rgba(34,211,238,0.12)",
    borderColor: "rgba(103,232,249,0.55)",
  },
  textTransform: "none",
}));

export const ImmunityList = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: 10,
  marginTop: 8,
}));

export const ImmunityItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 10,
  background: "rgba(9,25,38,0.8)",
  border: "1px solid rgba(103,232,249,0.12)",
  "@media (max-width: 480px)": {
    alignItems: "flex-start",
    padding: "10px",
    gap: 8,
  },
}));
