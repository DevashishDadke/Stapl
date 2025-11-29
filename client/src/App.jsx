import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Activity from "./pages/Activity/Activities";
import ProtectedRoute from "./components/ProtectedRoute";
import Insights from "./pages/Activity/Insights";
import LogActivity from "./pages/Activity/LogActivity";

function App() {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken); 
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <LogActivity />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
