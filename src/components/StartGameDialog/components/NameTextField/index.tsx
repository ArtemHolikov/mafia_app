import { Box, Typography } from "@mui/material";
import { AddPlayerButton, PlayersTextField } from "./index.styles";
import { useGameStore } from "../../../../store/gameStore";
import { useState } from "react";

export const NameTextField = () => {
  const addPlayer = useGameStore((state: any) => state.addPlayer);
  const players = useGameStore((state: any) => state.players);

  const [nickname, setNickname] = useState<string>("");

  const handleAddPlayer = () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;

    const nextOrder = players.length + 1;
    addPlayer(trimmed, nextOrder);
    setNickname("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <PlayersTextField
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddPlayer();
          }}
          value={nickname}
          placeholder="Player nickname"
          size="small"
        />
        <AddPlayerButton onClick={handleAddPlayer} disabled={!nickname.trim()}>
          Add
        </AddPlayerButton>
      </Box>
      <Typography sx={{ color: "rgba(248,250,252,0.7)", fontSize: "0.85rem" }}>
        Type a nickname and press Enter or click Add. Drag to reorder.
      </Typography>
    </Box>
  );
};
