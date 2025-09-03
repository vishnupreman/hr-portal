import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./pages/Register"; 
import { VerifyOtp } from "./pages/VerifyOtp";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { HrHome } from "./pages/HrHome";
import { EmployeeHome } from "./pages/EmployeeHome";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
         <Route path="/login" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />
                 <Route
          path="/hr/home"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <HrHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/home"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
