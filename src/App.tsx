import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AcquaintancePage } from "./pages/AcquaintancePage";
import { VotingPage } from "./pages/VotingPage";
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
