import { Box, Button, Dialog, Divider, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
          "@media (max-width: 600px)": {
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            height: "100vh",
            maxHeight: "100vh",
            borderRadius: 0,
            "@supports (height: 100dvh)": {
              height: "100dvh",
              maxHeight: "100dvh",
            },
          },
        },
      }}
    >
      <DialogBody
        sx={{
          "@media (max-width: 600px)": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
            maxWidth: "none",
            margin: "0 auto",
            overflowY: "auto",
            padding:
              "calc(12px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom))",
            border: 0,
            boxShadow: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}
        >
          <SettingPlayerInfoTitle sx={{ mb: 0, textAlign: "left" }}>
            Assign a role
          </SettingPlayerInfoTitle>
          <IconButton
            onClick={handleClose}
            aria-label="Close player role setup"
            sx={{
              color: "rgba(248,250,252,0.8)",
              width: 44,
              height: 44,
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(103,232,249,0.2)",
          }}
        />
        <Box sx={{ padding: { xs: "10px 0", sm: "16px" } }}>
          <PlayerInfoWrapper
            sx={{
              "@media (max-width: 600px)": {
                alignItems: "center",
                flexDirection: "row",
                padding: "12px 14px",
                gap: 12,
              },
            }}
          >
            <Box>
              <PlayerInfoText sx={{ color: "rgba(248,250,252,0.56)", fontSize: "0.78rem" }}>
                PLAYER {String(id).padStart(2, "0")}
              </PlayerInfoText>
              <PlayerInfoText sx={{ fontSize: "1.08rem", overflowWrap: "anywhere" }}>
                {nickname}
              </PlayerInfoText>
              <PlayerInfoText sx={{ color: "#67e8f9", fontSize: "0.86rem" }}>
                {selectedRoleLabel}
              </PlayerInfoText>
            </Box>
            <img
              src={roleImageToDisplay}
              width={96}
              height={96}
              alt={`${selectedRoleLabel} role`}
              style={{
                width: "clamp(72px, 24vw, 96px)",
                height: "clamp(72px, 24vw, 96px)",
                objectFit: "contain",
                flex: "0 0 auto",
              }}
            />
          </PlayerInfoWrapper>
        </Box>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            background: "rgba(103,232,249,0.2)",
          }}
        />
        <Box sx={{ padding: { xs: "14px 0 0", sm: "24px 16px 0" } }}>
          <PlayerInfoText sx={{ mb: 1.5 }}>Available roles</PlayerInfoText>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              gap: { xs: 1, sm: 1 },
              "@media (max-width: 600px)": {
                gridTemplateColumns: "minmax(0, 1fr)",
              },
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
                    width: "100%",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 700,
                    px: 1,
                    "@media (max-width: 380px)": {
                      fontSize: "0.78rem",
                    },
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
          <PlayerInfoText
            sx={{
              mt: 1.5,
              color: "rgba(248,250,252,0.62)",
              fontSize: "0.84rem",
            }}
          >
            Choose an available role to assign it to this player.
          </PlayerInfoText>
        </Box>
      </DialogBody>
    </Dialog>
  );
};
