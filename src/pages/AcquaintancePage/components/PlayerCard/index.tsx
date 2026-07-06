import { Avatar, Box, Card, Typography } from "@mui/material";

import Don from "../../../../images/don_logo.png";
import { CardWrapper } from "./index.styles";

interface PlayerCardProps {
  nickname: string;
  tableOrder: number;
  role: string;
}

export const PlayerCard = ({ nickname, tableOrder, role }: PlayerCardProps) => {
  return (
    <CardWrapper>
      <Box>
        <Typography>
          {tableOrder} | {nickname}
        </Typography>
        <Typography>{role}</Typography>
      </Box>
      <img src={Don} width={85} height={85} />
    </CardWrapper>
  );
};
