
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', number: '' });
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      window.location.href = '/dashboard';
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="Phone" onChange={e => setForm({ ...form, number: e.target.value })} />
      <input placeholder="Address" onChange={e => setForm({ ...form, address: e.target.value })} />
      <button type="submit">Sign Up</button>
    </form>
  );
}
