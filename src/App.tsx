import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AcquaintancePage } from "./pages/AcquaintancePage";
import { VotingPage } from "./pages/VotingPage";
import { NightPage } from "./pages/NightPage";
import { DayPage } from "./pages/DayPage";
import { appTheme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/acquaintance" element={<AcquaintancePage />} />
          <Route path="/voting" element={<VotingPage />} />
          <Route path="/night" element={<NightPage />} />
          <Route path="/day" element={<DayPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
