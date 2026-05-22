import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Welcome from "../../pages/Welcome/Welcome";
import Dashboard from "../Dashboard/Dashboard";
import log from "../../utils/logger";
import "./App.css";

function App() {
  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  // Health ping the backend
  useEffect(() => {
    fetch(baseUrl + "/health")
      .then((res) =>
        res.ok ? res.json() : Promise.reject({ status: res.status }),
      )
      .then((data) => {
        log("general", "Backend health check:", data);
      })
      .catch((error) => {
        log("error", "Error connecting to backend:", error);
      });
  }, [baseUrl]);

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
