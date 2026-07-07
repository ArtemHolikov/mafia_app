import { Avatar, Box, Card, Typography } from "@mui/material";

import { CardWrapper, OrderNicknameText, RoleText } from "./index.styles";
import { imageToDisplay } from "../../../../constants";
import { useState } from "react";
import { AcquaintancePlayerModal } from "../AcquaintancePlayerModal";

interface PlayerCardProps {
  id: number;
  nickname: string;
  tableOrder: number;
  role: string;
}

export const PlayerCard = ({
  id,
  nickname,
  tableOrder,
  role,
}: PlayerCardProps) => {
  const [openModal, setOpenModal] = useState(false);

  const handleClickPlayerCard = () => {
    setOpenModal(true);
  };

  return (
    <>
      <CardWrapper onClick={handleClickPlayerCard}>
        <Box>
          <OrderNicknameText>
            {tableOrder} | {nickname}
          </OrderNicknameText>
          <RoleText>{role}</RoleText>
        </Box>
        <img src={imageToDisplay[role.toLowerCase()]} width={85} height={85} />
      </CardWrapper>

      {openModal && (
        <AcquaintancePlayerModal
          id={id}
          nickname={nickname}
          open={openModal}
          setOpen={setOpenModal}
          role={role}
        />
      )}
    </>
  );
};
