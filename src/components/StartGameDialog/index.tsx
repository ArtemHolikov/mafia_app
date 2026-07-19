import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  GoToAcquaintancePhase,
  ImmunityButton,
  ImmunityItem,
  ImmunityList,
  NoPlayersMessage,
  PlayerItem,
  PlayerItemInfoText,
  PlayersBox,
  PlayersList,
  RoleCountField,
  RoleInfo,
  RoleRow,
  RoleToggleField,
  SettingsLobbyTitle,
  StartGameDialogBody,
  TabPanelBox,
  TotalCountChip,
} from "./index.styles";
import { useGameStore } from "../../store/gameStore";
import { NameTextField } from "./components/NameTextField";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

interface StartGameDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const StartGameDialog = ({
  isOpen,
  setIsOpen,
}: StartGameDialogProps) => {
  const handleClose = (): void => {
    setIsOpen(false);
  };

  const players = useGameStore((state: any) => state.players);
  const roleLimits = useGameStore((state: any) => state.roleLimits);
  const selectedGameRoles = useGameStore(
    (state: any) => state.selectedGameRoles,
  );
  const updateSelectedRoleCount = useGameStore(
    (state: any) => state.updateSelectedRoleCount,
  );
  const setPlayerImmunity = useGameStore(
    (state: any) => state.setPlayerImmunity,
  );
  const setPhase = useGameStore((state: any) => state.setPhase);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedImmunityPlayerId, setSelectedImmunityPlayerId] = useState<
    number | null
  >(null);
  const [immunityNights, setImmunityNights] = useState(1);
  const [isImmunityModalOpen, setIsImmunityModalOpen] = useState(false);

  const sortedPlayers = [...players].sort(
    (a: any, b: any) => a.tableOrder - b.tableOrder,
  );

  const handleSwitchToAcquaintancePhase = () => {
    setPhase("night acquaintance");
    handleClose();

    navigate("/acquaintance");
  };

  const handleTabChange = (_: React.SyntheticEvent, value: number) => {
    setActiveTab(value);
  };

  const handleRoleCountChange = (role: string, value: number) => {
    const roleLimit = roleLimits[role as keyof typeof roleLimits];
    if (!roleLimit) return;
    const clamped = Math.min(Math.max(value, roleLimit.min), roleLimit.max);
    updateSelectedRoleCount(role, clamped);
  };

  const handleRoleToggle = (role: string, enabled: boolean) => {
    updateSelectedRoleCount(role, enabled ? 1 : 0);
  };

  const handleSaveImmunity = () => {
    if (selectedImmunityPlayerId !== null) {
      setPlayerImmunity(selectedImmunityPlayerId, immunityNights);
    }
  };

  const handleOpenImmunityModal = (playerId: number | null) => {
    setSelectedImmunityPlayerId(playerId);
    setImmunityNights(
      playerId
        ? (players.find((player: any) => player.id === playerId)
            ?.immunityNights ?? 1)
        : 1,
    );
    setIsImmunityModalOpen(true);
  };

  const handleCloseImmunityModal = () => setIsImmunityModalOpen(false);

  const handleSaveImmunityModal = () => {
    if (selectedImmunityPlayerId !== null) {
      setPlayerImmunity(selectedImmunityPlayerId, immunityNights);
    }
    setIsImmunityModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <StartGameDialogBody>
        <SettingsLobbyTitle>Lobby setup</SettingsLobbyTitle>
        <Typography sx={{ color: "rgba(248,250,252,0.75)", mb: 2 }}>
          Add players, assign their table order, and launch the game flow.
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 2 }}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Players" />
          <Tab label="Immunity" disabled={players.length === 0} />
          <Tab label="Roles" />
        </Tabs>

        {activeTab === 0 && (
          <TabPanelBox>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <SettingsLobbyTitle>Players</SettingsLobbyTitle>
              <TotalCountChip>{players.length} total</TotalCountChip>
            </Box>
            <NameTextField />
            <PlayersList>
              {sortedPlayers.map((player: any) => (
                <PlayerItem key={player.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PlayerItemInfoText>
                      #{player.tableOrder}
                    </PlayerItemInfoText>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ borderColor: "rgba(255,255,255,0.14)" }}
                    />
                    <PlayerItemInfoText>{player.nickname}</PlayerItemInfoText>
                  </Box>
                </PlayerItem>
              ))}

              {sortedPlayers.length === 0 && (
                <NoPlayersMessage>No players yet</NoPlayersMessage>
              )}
            </PlayersList>
          </TabPanelBox>
        )}

        {activeTab === 1 && (
          <TabPanelBox>
            <SettingsLobbyTitle>Immunity</SettingsLobbyTitle>
            <ImmunityButton onClick={() => handleOpenImmunityModal(null)}>
              + Add immunity
            </ImmunityButton>
            <ImmunityList>
              {sortedPlayers
                .filter((player: any) => (player.immunityNights ?? 0) > 0)
                .map((player: any) => (
                  <ImmunityItem key={player.id}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#fff" }}>
                        {player.nickname}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(248,250,252,0.72)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {player.immunityNights} night(s) remaining
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenImmunityModal(player.id)}
                    >
                      Edit
                    </Button>
                  </ImmunityItem>
                ))}
            </ImmunityList>
          </TabPanelBox>
        )}

        {activeTab === 2 && (
          <TabPanelBox>
            <SettingsLobbyTitle>Roles</SettingsLobbyTitle>
            <Box
              sx={{
                overflow: "auto",
                maxHeight: "360px",
                scrollbarColor: "grey transparent",
                scrollbarWidth: "thin",
              }}
            >
              {Object.entries(roleLimits).map(([role, limits]: any) => {
                const roleCount =
                  selectedGameRoles[role as keyof typeof selectedGameRoles] ??
                  0;
                const isMultiRole = limits.max > 1;

                return (
                  <RoleRow key={role}>
                    <RoleInfo>
                      <Typography sx={{ fontWeight: 700, color: "#fff" }}>
                        {role}
                      </Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.68)" }}>
                        {limits.min}-{limits.max}
                      </Typography>
                    </RoleInfo>

                    {isMultiRole ? (
                      <RoleCountField>
                        <TextField
                          select
                          size="small"
                          value={roleCount}
                          onChange={(event) =>
                            handleRoleCountChange(
                              role,
                              Number(event.target.value),
                            )
                          }
                          sx={{
                            width: 100,
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: 2,
                          }}
                        >
                          {Array.from(
                            { length: limits.max - limits.min + 1 },
                            (_, index) => {
                              const value = limits.min + index;
                              return (
                                <MenuItem key={value} value={value}>
                                  {value}
                                </MenuItem>
                              );
                            },
                          )}
                        </TextField>
                      </RoleCountField>
                    ) : (
                      <RoleToggleField>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={roleCount > 0}
                              onChange={(_, checked) =>
                                handleRoleToggle(role, checked)
                              }
                              color="secondary"
                            />
                          }
                          label={roleCount > 0 ? "Enabled" : "Disabled"}
                          sx={{ color: "rgba(248,250,252,0.75)" }}
                        />
                      </RoleToggleField>
                    )}
                  </RoleRow>
                );
              })}
            </Box>
          </TabPanelBox>
        )}

        <GoToAcquaintancePhase
          disabled={sortedPlayers.length === 0}
          onClick={handleSwitchToAcquaintancePhase}
        >
          Start acquaintance
        </GoToAcquaintancePhase>
      </StartGameDialogBody>

      <Dialog open={isImmunityModalOpen} onClose={handleCloseImmunityModal}>
        <DialogTitle>Set immunity</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Choose a player and how many nights they should be immune to
            mafia/maniac kills.
          </DialogContentText>
          <TextField
            fullWidth
            select
            label="Player"
            value={selectedImmunityPlayerId ?? ""}
            onChange={(event) =>
              setSelectedImmunityPlayerId(Number(event.target.value))
            }
            size="small"
            sx={{
              mb: 2,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
            }}
          >
            {sortedPlayers.map((player: any) => (
              <MenuItem key={player.id} value={player.id}>
                {player.nickname}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Nights"
            type="number"
            value={immunityNights}
            onChange={(event) => setImmunityNights(Number(event.target.value))}
            size="small"
            slotProps={{
              htmlInput: {
                min: 1,
                max: 10,
              },
            }}
            sx={{ background: "rgba(255,255,255,0.06)", borderRadius: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImmunityModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveImmunityModal}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
