import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alert";
import SelectLocation from "./pages/SelectLocation";
import AddLocation from "./pages/AddLocation";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import AddReading from "./pages/AddReading";
import Questionnaire from "./pages/Questionnaire";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminRoute from "./AdminRoute";
import AdminReports from "./admin/AdminReports";

import CookieConsentModal from "./components/modals/CookieConsentModal";
import LocationPermissionModal from "./components/modals/LocationPermissionModal";

function App() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showCookies, setShowCookies] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  // ✅ SHOW COOKIES ONLY FIRST VISIT
  useEffect(() => {
    if (!localStorage.getItem("cookiesAccepted")) {
      setShowCookies(true);
    }
  }, []);

  // ✅ SHOW LOCATION AFTER LOGIN ONLY ONCE
  useEffect(() => {
    if (
      user &&
      !localStorage.getItem("locationAllowed")
    ) {
      setShowLocation(true);
    }
  }, [user]);

  // -------------------------

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookies(false);

    if (!user) navigate("/login");
  };

  const rejectCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setShowCookies(false);

    if (!user) navigate("/login");
  };


  const allowLocation = () => {
    localStorage.setItem("locationAllowed", "true");
    setShowLocation(false);
  };

  const denyLocation = () => {
    localStorage.setItem("locationAllowed", "false");
    setShowLocation(false);
  };

  // -------------------------

  return (
    <>
      {/* COOKIES */}
      <CookieConsentModal
        open={showCookies}
        onAccept={acceptCookies}
        onReject={rejectCookies}
      />

      {/* LOCATION */}
      <LocationPermissionModal
        open={showLocation}
        onAllow={allowLocation}
        onDeny={denyLocation}
      />

      {/* ROUTES */}
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Dashboard />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>

          <Route path="/profile" element={<Profile />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/select-location" element={<SelectLocation />} />
          <Route path="/add-location" element={<AddLocation />} />
          <Route path="/add-reading" element={<AddReading />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

      
       {/* ADMIN */}
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/users" element={<AdminUsers />} />
  <Route path="/admin/reports" element={<AdminReports />} />
</Route>



      </Routes>
    </>
  );
}

export default App;
