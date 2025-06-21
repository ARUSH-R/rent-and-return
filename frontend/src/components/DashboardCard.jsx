import React from "react";

/**
 * DashboardCard
 * Props:
 * - title: string (card title)
 * - value: string | number (main value to display)
 * - icon: ReactNode (optional icon)
 * - color: string (one of Tailwind color, e.g. "blue", "green", "red", "yellow")
 * - footer: string | ReactNode (optional, for extra info)
 */
const DashboardCard = ({
  title,
  value,
  icon,
  color = "blue",
  footer,
}) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-700 border-red-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
    gray: "bg-gray-100 text-gray-700 border-gray-300",
  };
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`border ${colors} rounded-lg shadow-sm p-5 flex flex-col justify-between h-full`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-3xl" aria-hidden>
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-3xl font-bold my-4 text-right">{value}</div>
      {footer && (
        <div className="text-xs mt-2 text-right text-gray-500">{footer}</div>
      )}
    </div>
  );
};

export default DashboardCard;