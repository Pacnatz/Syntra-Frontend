import { Routes, Route } from "react-router-dom";

import Welcome from "../../pages/Welcome/Welcome";
import Dashboard from "../../pages/Dashboard/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    </div>
  );
}

export default App;
