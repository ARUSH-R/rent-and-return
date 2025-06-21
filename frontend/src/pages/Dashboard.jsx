import React from 'react';
import useAdminStats from '../hooks/useAdminStats';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { stats, loading } = useAdminStats();

  if (loading) return <Loader />;

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? 0,
    },
    {
      title: 'Total Rentals',
      value: stats?.totalRentals ?? 0,
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() ?? 0}`,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <DashboardCard key={idx} title={card.title} value={card.value} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
