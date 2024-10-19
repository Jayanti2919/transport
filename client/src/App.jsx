import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/LoginPages/AdminLogin";
import DriverLogin from "./pages/LoginPages/DriverLogin";
import UserLogin from "./pages/LoginPages/UserLogin";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AvailableVehicles from "./pages/AdminPages/FleetManagement/AvailableVehicles";
import DriverPerformance from "./pages/AdminPages/DataAnalytics/DriverPerformance";

function App() {
  return (
    <Router>
      <div className="bg-primary min-h-screen recursive">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/adminLogin" element={<AdminLogin/>} />
          <Route path="/driverLogin" element={<DriverLogin/>} />
          <Route path="/userLogin" element={<UserLogin/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/availableVehicles" element={<AvailableVehicles/>} />
          <Route path="/admin/driverPerformance" element={<DriverPerformance/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;