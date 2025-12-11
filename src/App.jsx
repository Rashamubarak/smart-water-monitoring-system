import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alert";
import SelectLocation from "./pages/SelectLocation";
import AddLocation from "./pages/AddLocation";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import AddReading from "./pages/AddReading";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Questionnaire from "./pages/Questionnaire";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/select-location"
          element={
            <ProtectedRoute>
              <SelectLocation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-location"
          element={
            <ProtectedRoute>
              <AddLocation />
            </ProtectedRoute>
          }
        />

        {/* NEW: ADD READING PAGE */}
        <Route
          path="/add-reading"
          element={
            <ProtectedRoute>
              <AddReading />
            </ProtectedRoute>
          }
        />

        {/* REPORTS PAGE */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
