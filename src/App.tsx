import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AcquaintancePage } from "./pages/AcquaintancePage";
import { VotingPage } from "./pages/VotingPage";

function App() {
  return (
    <BrowserRouter>
      {/* Route Switchboard */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/acquaintance" element={<AcquaintancePage />} />
        <Route path="/voting" element={<VotingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
