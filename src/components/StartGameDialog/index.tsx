import { Box, Dialog, Divider, Typography } from "@mui/material";
import { PlayersBox, SettingsLobbyTitle, StartGameDialogBody } from "./index.styles";
import { useGameStore } from "../../store/gameStore";
import { NameTextField } from "./components/NameTextField";

interface StartGameDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const StartGameDialog = ({ isOpen, setIsOpen }: StartGameDialogProps) => {
    const handleClose = (): void => {
        setIsOpen(false);
    }
    
    const players = useGameStore((state: any) => state.players);

    console.log(players);
    
    
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <StartGameDialogBody>
                <SettingsLobbyTitle>Lobby Settings</SettingsLobbyTitle>
                <Divider sx={{width: '100%', height: '2px', background: '#1e1e1e'}} />
                <PlayersBox>
                    <SettingsLobbyTitle>Players ({players.length})</SettingsLobbyTitle>
                    <NameTextField />
                </PlayersBox>
            </StartGameDialogBody>
        </Dialog>
    )
}