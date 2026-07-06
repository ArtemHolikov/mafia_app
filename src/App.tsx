import React, { useState } from 'react';
import { AppWrapper, StartGameButton } from './App.styles';
import backgroundImage from './images/backgroundPhoto.png';
import { StartGameDialog } from './components/StartGameDialog';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  return (
    <AppWrapper {...({ bgimage: backgroundImage } as any)}>
      <StartGameButton onClick={handleOpen}>Start game</StartGameButton>
      <StartGameDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </AppWrapper>
  );
}

export default App;
