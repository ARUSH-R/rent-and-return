import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

const Login = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
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
    if (!form.identifier || !form.password) {
      setFormError("Email, phone, or username and password are required.");
      return;
    }
    const success = await login(form.identifier, form.password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-yellow-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src="/assets/logo.svg" alt="RentReturn Logo" className="h-12 mb-6" />
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 tracking-tight">Sign-In</h2>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="identifier">
              Email or mobile phone number or username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-yellow-50 font-medium"
              value={form.identifier}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter email, phone, or username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-yellow-50 font-medium"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          {(formError || error) && (
            <div className="text-red-600 text-sm font-semibold">{formError || error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 py-2 rounded font-bold hover:bg-yellow-500 transition flex justify-center items-center border border-yellow-500 shadow-sm mt-2"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : "Sign-In"}
          </button>
        </form>
        <div className="w-full flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-gray-400 font-medium">New to RentReturn?</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <a className="w-full text-center bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition block" href="/register">
          Create your RentReturn account
        </a>
      </div>
    </div>
  );
};

export default Login;