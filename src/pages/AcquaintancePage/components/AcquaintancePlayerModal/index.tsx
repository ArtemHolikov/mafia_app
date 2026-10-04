import { Box, Button, Dialog, Divider } from "@mui/material";
import {
  DialogBody,
  PlayerInfoText,
  PlayerInfoWrapper,
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

  const handleSelectRole = (value: string, label: string) => {
    if (label === selectedRoleLabel) {
      return;
    }

    setSelectedRoleValue(value);
    setSelectedRoleLabel(label);
    changeRole(id, label);
    handleClose();
  };

  useEffect(() => {
    if (selectedRoleValue && selectedRoleValue !== "") {
      setRoleImageToDisplay(
        imageToDisplay[selectedRoleValue.toLocaleLowerCase()],
      );
    }
  }, [selectedRoleValue]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          overflow: "hidden",
          borderRadius: 3,
          background: "#07111d",
          boxShadow:
            "0 28px 84px rgba(2,6,23,0.78), 0 0 42px rgba(34,211,238,0.1)",
        },
      }}
    >
      <DialogBody>
        <SettingPlayerInfoTitle>Setup Player</SettingPlayerInfoTitle>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(103,232,249,0.2)",
          }}
        />
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
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(103,232,249,0.2)",
          }}
        />
        <Box sx={{ padding: "24px 16px 0" }}>
          <PlayerInfoText sx={{ mb: 1.5 }}>Pick a role</PlayerInfoText>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              gap: 1,
            }}
          >
            {rolesArray.map((roleOption) => {
              const isSelected = roleOption.label === selectedRoleLabel;
              const availableCount =
                selectedGameRoles[
                  roleOption.label as keyof typeof selectedGameRoles
                ] ?? 0;
              const assignedCount = assignedRoleCounts[roleOption.label] ?? 0;
              const isDisabled = !isSelected && availableCount <= assignedCount;

              return (
                <Button
                  key={roleOption.value}
                  variant={isSelected ? "contained" : "outlined"}
                  disabled={isDisabled || isSelected}
                  onClick={() =>
                    handleSelectRole(roleOption.value, roleOption.label)
                  }
                  sx={{
                    minHeight: 48,
                    textTransform: "none",
                    borderRadius: 1.5,
                    fontWeight: 700,
                    borderColor: isSelected
                      ? "rgba(103,232,249,0.55)"
                      : "rgba(103,232,249,0.2)",
                    color: isSelected ? "#04121b" : "#cffafe",
                    background: isSelected
                      ? "linear-gradient(110deg, #22d3ee, #34d399)"
                      : "rgba(8,47,60,0.24)",
                    boxShadow: isSelected
                      ? "0 0 22px rgba(34,211,238,0.25)"
                      : "none",
                    "&:hover": {
                      borderColor: "rgba(103,232,249,0.58)",
                      background: "rgba(8,47,60,0.52)",
                    },
                    "&.Mui-disabled": isSelected
                      ? {
                          color: "#04121b",
                          background:
                            "linear-gradient(110deg, #0b6775, #397e65)",
                          opacity: 1,
                        }
                      : {},
                  }}
                >
                  {roleOption.label}
                </Button>
              );
            })}
          </Box>
          <PlayerInfoText sx={{ mt: 2, color: "rgba(248,250,252,0.7)" }}>
            The current role button is disabled. Pick any other available role
            to assign it immediately.
          </PlayerInfoText>
        </Box>
      </DialogBody>
    </Dialog>
  );
};
