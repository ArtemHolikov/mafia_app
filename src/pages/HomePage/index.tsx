import { useState } from "react";
import { AppWrapper, StartGameButton } from "./index.styles";
import { StartGameDialog } from "../../components/StartGameDialog";

import backgroundImage from "../../images/backgroundPhoto.png";

export const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <AppWrapper {...({ bgimage: backgroundImage } as any)}>
      <StartGameButton onClick={handleOpen}>Start game</StartGameButton>
      <StartGameDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </AppWrapper>
  );
};
