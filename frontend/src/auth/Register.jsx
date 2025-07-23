import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContextUtils";
import Loader from "../components/Loader";

const Register = () => {
  const { register, loading, error, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated) {
    // Already logged in
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.username || !form.email || !form.password) {
      setFormError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    const success = await register(form);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="bg-white rounded shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          {(formError || error) && (
            <div className="text-red-600 text-sm">{formError || error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition font-semibold flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : "Register"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a className="text-blue-700 hover:underline" href="/login">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;