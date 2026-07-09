import { Box, Typography } from "@mui/material";
import {
  AddPlayerButton,
  PlayerOrderField,
  PlayersTextField,
} from "./index.styles";
import { useGameStore } from "../../../../store/gameStore";
import { useState } from "react";

export const NameTextField = () => {
  const addPlayer = useGameStore((state: any) => state.addPlayer);
  const players = useGameStore((state: any) => state.players);

  const [nickname, setNickname] = useState<string>("");
  const [tableOrder, setTableOrder] = useState<number | null>(null);

  const handleChangeNickname = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNickname(e.target.value);
  };

  const handleChangeTableOrder = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (Number(e.target.value) > 0) {
      setTableOrder(Number(e.target.value));
    } else {
      setTableOrder(null);
    }
  };

  const handleAddPlayer = () => {
    if (
      !nickname ||
      nickname.trim() === "" ||
      tableOrder === null ||
      tableOrder === 0
    ) {
      return;
    }

    if (
      players &&
      players.some((player: any) => player.tableOrder === tableOrder)
    )
      return;

    addPlayer(nickname.trim(), tableOrder);
    setNickname("");
    setTableOrder(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <PlayersTextField
          onChange={(e) => handleChangeNickname(e)}
          value={nickname}
          placeholder="Player nickname"
          size="small"
        />
        <PlayerOrderField
          onChange={(e) => handleChangeTableOrder(e)}
          value={tableOrder ?? ""}
          type="number"
          placeholder="#"
          size="small"
          slotProps={{
            input: {
              sx: {
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              },
            },
          }}
        />
        <AddPlayerButton
          onClick={handleAddPlayer}
          disabled={!(nickname && tableOrder)}
        >
          Add
        </AddPlayerButton>
      </Box>
      <Typography sx={{ color: "rgba(248,250,252,0.7)", fontSize: "0.85rem" }}>
        Enter a nickname and a unique table order to build the lobby.
      </Typography>
    </Box>
  );
};
