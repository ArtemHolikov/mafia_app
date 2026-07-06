import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AcquaintancePage } from "./pages/AcquaintancePage";

function App() {
  return (
    <BrowserRouter>
      {/* Route Switchboard */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/acquaintance" element={<AcquaintancePage />} />
        {/* Catch-all for undefined URLs */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
