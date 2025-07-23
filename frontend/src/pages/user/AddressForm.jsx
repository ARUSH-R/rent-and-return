import { useState, useEffect } from 'react';
import api from '../../api/api';
import Loader from '../../components/Loader';

const AddressForm = ({ address, onClose }) => {
  const [form, setForm] = useState({
    name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (address) setForm(address);
  }, [address]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (address) {
        await api.put(`/v1/addresses/${address.id}`, form);
      } else {
        await api.post('/v1/addresses', form);
      }
      onClose();
    } catch (err) {
      setError('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-6">
      <button onClick={onClose} className="absolute top-2 right-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-all text-lg">×</button>
      <h2 className="text-xl font-bold mb-4 text-blue-700">{address ? 'Edit Address' : 'Add Address'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
        </div>
        <input name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Address Line 1" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
        <input name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Address Line 2" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
          <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
        </div>
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 hover:shadow" required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full py-2 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition disabled:opacity-60" disabled={loading}>{loading ? <Loader size="sm" /> : (address ? 'Update Address' : 'Add Address')}</button>
      </form>
    </div>
  );
};

export default AddressForm; 