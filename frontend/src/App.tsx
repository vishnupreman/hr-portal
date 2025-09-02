import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HrHome from "./pages/HrHome";
import EmployeeHome from "./pages/EmployeeHome";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/hr-home"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <HrHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-home"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
