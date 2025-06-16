// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function Dashboard() {
  return <h2 className="text-center mt-20 text-2xl">Dashboard (Protected)</h2>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><h1>Admin Panel</h1></ProtectedRoute>} />
          <Route path="/" element={<h1 className="text-center mt-20 text-2xl">Welcome to RENTRETURN</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
