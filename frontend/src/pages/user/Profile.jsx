import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import Loader from '../../components/Loader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    UserService.getProfile()
      .then((res) => setUser(res.data))
      .catch(() => setError('Failed to load user profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="space-y-4 text-gray-800">
        <div>
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role}
        </div>
        <div>
          <span className="font-semibold">Joined:</span>{' '}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Last Updated:</span>{' '}
          {new Date(user.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
