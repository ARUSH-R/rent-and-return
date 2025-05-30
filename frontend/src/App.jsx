
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';


export default function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}