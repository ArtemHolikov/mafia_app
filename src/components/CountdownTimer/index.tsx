import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

interface CountdownTimerProps {
  label: string;
  secondsLeft: number;
  totalSeconds: number;
  running: boolean;
  onSecondsChange: (seconds: number) => void;
  onRunningChange: (running: boolean) => void;
  onReset: () => void;
  width?: number | string;
  accentColor?: string;
  mobileInline?: boolean;
}

const RESET_DELAY_MS = 1200;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const CountdownTimer = ({
  label,
  secondsLeft,
  totalSeconds,
  running,
  onSecondsChange,
  onRunningChange,
  onReset,
  width = 260,
  accentColor = "#22d3ee",
  mobileInline = false,
}: CountdownTimerProps) => {
  const safeSeconds = Number.isFinite(secondsLeft) ? secondsLeft : totalSeconds;
  const secondsRef = useRef(safeSeconds);
  const callbacksRef = useRef({ onSecondsChange, onRunningChange, onReset });

  useEffect(() => {
    secondsRef.current = safeSeconds;
    callbacksRef.current = { onSecondsChange, onRunningChange, onReset };
  });

  useEffect(() => {
    if (!running) return;

    const intervalId = window.setInterval(() => {
      const next = Math.max(0, secondsRef.current - 1);
      secondsRef.current = next;
      callbacksRef.current.onSecondsChange(next);
      if (next === 0) {
        callbacksRef.current.onRunningChange(false);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [running]);

  // Restore the configured time shortly after reaching 00:00
  useEffect(() => {
    if (safeSeconds !== 0) return;

    const timeoutId = window.setTimeout(() => {
      callbacksRef.current.onReset();
    }, RESET_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [safeSeconds]);

  const progress =
    totalSeconds > 0 ? Math.min(1, Math.max(0, safeSeconds / totalSeconds)) : 0;
  const isCritical = safeSeconds <= 10 && safeSeconds > 0 && running;
  const isEmpty = safeSeconds === 0;
  const color = isEmpty || isCritical ? "#fb7185" : accentColor;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        px: 2.5,
        py: 1.75,
        width,
        maxWidth: "100%",
        boxSizing: "border-box",
        "@media (max-width: 600px)": {
          width: mobileInline ? "auto" : "100%",
          minWidth: 0,
          flex: mobileInline ? "1 1 50%" : undefined,
          px: 1.25,
          py: 1,
          gap: 0.5,
          borderRadius: 2,
          ...(mobileInline && {
            px: 0,
            py: 0,
            border: 0,
            background: "transparent",
            boxShadow: "none",
            backdropFilter: "none",
          }),
        },
        borderRadius: 3,
        border: `1px solid ${color}40`,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        boxShadow: running ? `0 0 28px ${color}26` : "none",
        backdropFilter: "blur(10px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        <Typography
          sx={{
            flex: 1,
            color: isEmpty || isCritical ? color : "#f8fafc",
            fontSize: { xs: "1.45rem", sm: "2rem" },
            fontWeight: 800,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            transition: "color 0.3s",
          }}
        >
          {formatTime(safeSeconds)}
        </Typography>
        <IconButton
          onClick={() => onRunningChange(!running)}
          aria-label={running ? "Pause timer" : "Start timer"}
          disabled={isEmpty}
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            color: "#04111d",
            bgcolor: color,
            "&:hover": { bgcolor: color, filter: "brightness(1.1)" },
            "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          {running ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
        <IconButton
          onClick={onReset}
          aria-label="Reset timer"
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            color: "rgba(248,250,252,0.85)",
            bgcolor: "rgba(255,255,255,0.08)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
          }}
        >
          <RestartAltRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
