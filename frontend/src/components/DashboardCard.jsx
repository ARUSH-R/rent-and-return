import React from 'react';

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
};

export default DashboardCard;
