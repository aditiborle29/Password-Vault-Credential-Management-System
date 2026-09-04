import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import AddCredential from "./pages/AddCredential";
import EditCredential from "./pages/EditCredential";
import ForgotPassword from "./pages/ForgotPassword";
import SharedCredentials from "./pages/SharedCredentials";
import SecurityDashboard from "./pages/SecurityDashboard";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/shared" element={<SharedCredentials />} />
        <Route path="/add" element={<AddCredential />} />
        <Route path="/edit/:id" element={<EditCredential />} />
        <Route
          path="/security"
          element={<SecurityDashboard />}
        />
        <Route path="/reports" element={<Reports />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;