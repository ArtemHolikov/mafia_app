import React from 'react';
import {styled, Box, Button} from '@mui/material';

export const AppWrapper = styled(Box)(({bgimage}) => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${bgimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: 'calc(100vh - 20px)',
    padding: 0,
    overflow: 'hidden',
    opacity: 0.9,
    position: 'relative',
}));

export const StartGameButton = styled(Button)({
    border: '1px solid #fff',
    fontSize: '18px',
    lineHeight: '36px',
    fontFamily: 'Calibre-R',
    fontWeight: 500,
    padding: '10px 16px',
    color: '#fff',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
})