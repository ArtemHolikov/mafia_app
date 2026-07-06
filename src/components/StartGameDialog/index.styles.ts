import { Box, styled, Typography } from "@mui/material";

export const StartGameDialogBody = styled(Box)({
    background: '#3b3b3b',
    width: '500px', 
    height: '700px'
})

export const SettingsLobbyTitle = styled(Typography)({
    fontSize: '24px',
    lineHeight: '36px',
    fontFamily: 'Calibre-R',
    fontWeight: 500,
    color: '#fff',
    padding: '15px 0',
    textAlign: 'center'
})

export const PlayersBox = styled(Box)({
    padding: '10px 20px',
})