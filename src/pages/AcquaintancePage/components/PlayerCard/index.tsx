import { Avatar, Box, Card, Typography } from "@mui/material";

import Don from "../../../../images/don_logo.png";
import Mafia from "../../../../images/mafia.png";
import Maniac from "../../../../images/maniac.png";
import Citizen from "../../../../images/mirniy.png";
import Doctor from "../../../../images/doctor.png";
import Sherif from "../../../../images/sherif.png";
import Journalist from "../../../../images/journalist.png";
import { CardWrapper, OrderNicknameText, RoleText } from "./index.styles";

interface PlayerCardProps {
  nickname: string;
  tableOrder: number;
  role: string;
}

export const PlayerCard = ({ nickname, tableOrder, role }: PlayerCardProps) => {
  const imageToDisplay: any = {
    don: Don,
    mafia: Mafia,
    maniac: Maniac,
    citizen: Citizen,
    doctor: Doctor,
    sherif: Sherif,
    journalist: Journalist,
  };

  return (
    <CardWrapper>
      <Box>
        <OrderNicknameText>
          {tableOrder} | {nickname}
        </OrderNicknameText>
        <RoleText>{role}</RoleText>
      </Box>
      <img src={imageToDisplay[role.toLowerCase()]} width={85} height={85} />
    </CardWrapper>
  );
};
