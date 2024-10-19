import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/LoginPages/AdminLogin";
import DriverLogin from "./pages/LoginPages/DriverLogin";
import UserLogin from "./pages/LoginPages/UserLogin";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;