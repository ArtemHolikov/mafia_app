import { Box, Dialog, Divider, FormControl, MenuItem } from "@mui/material";
import {
  ConfirmButton,
  ConfirmButtonBox,
  DialogBody,
  PlayerInfoText,
  PlayerInfoWrapper,
  SelectRole,
  SelectRoleWrapper,
  SettingPlayerInfoTitle,
} from "./index.styles";
import { imageToDisplay, MafiaRoles } from "../../../../constants";
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../../../store/gameStore";

interface AcquaintancePlayerModalProps {
  id: number;
  role: string;
  open: boolean;
  nickname: string;
  setOpen: (open: boolean) => void;
}

export const AcquaintancePlayerModal = ({
  id,
  role,
  nickname,
  open,
  setOpen,
}: AcquaintancePlayerModalProps) => {
  const changeRole = useGameStore((state: any) => state.changeRole);
  const selectedGameRoles = useGameStore(
    (state: any) => state.selectedGameRoles,
  );
  const players = useGameStore((state: any) => state.players);

  const roleValue = Object.entries(MafiaRoles)
    .flatMap((entry) => ({
      label: entry[0],
      value: entry[1],
    }))
    .find((r) => r.label === role) ?? {
    label: role,
    value: MafiaRoles.Citizen,
  };

  const [selectedRoleValue, setSelectedRoleValue] = useState<string>(
    roleValue.value,
  );
  const [selectedRoleLabel, setSelectedRoleLabel] = useState<string>(
    roleValue.label,
  );
  const [roleImageToDisplay, setRoleImageToDisplay] = useState<string>(
    imageToDisplay[role.toLocaleLowerCase()],
  );

  const handleClose = () => {
    setOpen(false);
  };

  const assignedRoleCounts = useMemo(
    () =>
      players.reduce((acc: Record<string, number>, player: any) => {
        const label = player.role;
        acc[label] = (acc[label] ?? 0) + 1;
        return acc;
      }, {}),
    [players],
  );

  const rolesArray = Object.entries(MafiaRoles)
    .map((entry) => ({
      label: entry[0],
      value: entry[1],
    }))
    .filter((option) => {
      const availableCount =
        selectedGameRoles[option.label as keyof typeof selectedGameRoles] ?? 0;
      const assignedCount = assignedRoleCounts[option.label] ?? 0;
      const isCurrent = option.label === role;
      return isCurrent || availableCount > assignedCount;
    });

  const handleChangeRole = (value: string, label: string) => {
    setSelectedRoleValue(value);
    setSelectedRoleLabel(label);
  };

  useEffect(() => {
    if (selectedRoleValue && selectedRoleValue !== "") {
      setRoleImageToDisplay(
        imageToDisplay[selectedRoleValue.toLocaleLowerCase()],
      );
    }
  }, [selectedRoleValue]);

  const handleSavePlayer = () => {
    changeRole(id, selectedRoleLabel);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogBody>
        <SettingPlayerInfoTitle>Setup Player</SettingPlayerInfoTitle>
        <Divider sx={{ width: "100%", height: "2px", background: "#1e1e1e" }} />
        <Box sx={{ padding: "16px" }}>
          <PlayerInfoWrapper>
            <Box>
              <PlayerInfoText>ID: {id}</PlayerInfoText>
              <PlayerInfoText>Nickname: {nickname}</PlayerInfoText>
              <PlayerInfoText>Role: {selectedRoleLabel}</PlayerInfoText>
            </Box>
            <img src={roleImageToDisplay} width={120} height={120} />
          </PlayerInfoWrapper>
        </Box>
        <Divider sx={{ width: "100%", height: "2px", background: "#1e1e1e" }} />
        <Box sx={{ padding: "40px 16px 0" }}>
          <SelectRoleWrapper>
            <PlayerInfoText>Set user role</PlayerInfoText>
            <FormControl size="small">
              <SelectRole
                value={selectedRoleValue}
                onChange={(event) => {
                  const value = event.target.value as string;
                  const selected = rolesArray.find((r) => r.value === value);
                  if (!selected) return;
                  handleChangeRole(selected.value, selected.label);
                }}
              >
                {rolesArray.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </SelectRole>
            </FormControl>
          </SelectRoleWrapper>
        </Box>
        <ConfirmButtonBox>
          <ConfirmButton onClick={handleSavePlayer}>Confirm</ConfirmButton>
        </ConfirmButtonBox>
      </DialogBody>
    </Dialog>
  );
};
