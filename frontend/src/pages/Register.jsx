// src/pages/Register.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        <input className="w-full p-2 mb-3 border" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="w-full p-2 mb-3 border" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="w-full p-2 mb-3 border" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <select className="w-full p-2 mb-4 border" name="role" value={form.role} onChange={handleChange}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
