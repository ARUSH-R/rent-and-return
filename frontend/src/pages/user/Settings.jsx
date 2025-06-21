import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import Loader from '../../components/Loader';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    UserService.getProfile()
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name);
      })
      .catch(() => setFormError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateProfile({ name });
      setSuccessMsg('Name updated successfully!');
    } catch {
      setFormError('Failed to update name.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return setFormError('Both current and new passwords are required.');
    }
    try {
      await UserService.changePassword({ currentPassword, newPassword });
      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setFormError('Failed to change password. Please check your current password.');
    }
  };

  if (loading) return <Loader />;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {formError && <p className="text-red-500 mb-3">{formError}</p>}
      {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}

      <form onSubmit={handleProfileUpdate} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">Update Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update Name
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            required
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Settings;
