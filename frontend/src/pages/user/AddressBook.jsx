import { useEffect, useState } from 'react';
import api from '../../api/api';
import Loader from '../../components/Loader';
import AddressForm from './AddressForm';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAddress, setEditAddress] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/addresses');
      setAddresses(res.data);
    } catch (e) {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (address) => {
    setEditAddress(address);
    setActiveTab('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    await api.delete(`/v1/addresses/${id}`);
    fetchAddresses();
  };

  const handleSetDefault = async (id) => {
    await api.put(`/v1/addresses/${id}/default`);
    fetchAddresses();
  };

  const handleFormClose = () => {
    setEditAddress(null);
    setActiveTab('list');
    fetchAddresses();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <div className="flex gap-4 mb-6 sticky top-0 z-10 bg-white rounded-t-lg shadow-sm">
        <button
          className={`flex-1 py-2 rounded-t-lg font-semibold transition-all ${activeTab==='list'?'bg-blue-600 text-white shadow':'bg-gray-100 text-blue-700 hover:bg-blue-50'}`}
          onClick={()=>{setActiveTab('list');}}
        >My Addresses</button>
        <button
          className={`flex-1 py-2 rounded-t-lg font-semibold transition-all ${activeTab==='form'?'bg-blue-600 text-white shadow':'bg-gray-100 text-blue-700 hover:bg-blue-50'}`}
          onClick={()=>{setActiveTab('form'); setEditAddress(null);}}
        >Add Address</button>
      </div>
      {activeTab==='form' && (
        <AddressForm address={editAddress} onClose={handleFormClose} />
      )}
      {activeTab==='list' && (
        loading ? <Loader size="lg" /> : (
          <div className="space-y-4">
            {addresses.length === 0 && <div className="text-gray-500 text-center">No addresses found.</div>}
            {addresses.map(addr => (
              <div key={addr.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-2 hover:shadow-lg transition group relative">
                <div className="flex-1">
                  <div className="font-semibold text-blue-700">{addr.name} {addr.isDefault && <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Default</span>}</div>
                  <div className="text-gray-700 text-sm">{addr.addressLine1}, {addr.addressLine2}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</div>
                  <div className="text-gray-500 text-xs">Phone: {addr.phone}</div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  {!addr.isDefault && <button onClick={()=>handleSetDefault(addr.id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Set Default</button>}
                  <button onClick={()=>handleEdit(addr)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Edit</button>
                  <button onClick={()=>handleDelete(addr.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AddressBook; 