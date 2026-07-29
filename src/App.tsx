import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { AcquaintancePage } from "./pages/AcquaintancePage";
import { VotingPage } from "./pages/VotingPage";
import { NightPage } from "./pages/NightPage";
import { DayPage } from "./pages/DayPage";
import { appTheme } from "./theme";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate(location.pathname + location.search, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname, location.search, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/acquaintance" element={<AcquaintancePage />} />
      <Route path="/voting" element={<VotingPage />} />
      <Route path="/night" element={<NightPage />} />
      <Route path="/day" element={<DayPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter basename="/mafia_app">
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
