import React from "react";

/**
 * Loader spinner
 * Props:
 * - size: "sm" | "md" | "lg" (default: "md")
 * - color: Tailwind text color class (default: "text-blue-600")
 * - className: Additional classes
 */
const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-4",
};

const Loader = ({ size = "md", color = "text-blue-600", className = "" }) => (
  <span
    className={`inline-block animate-spin rounded-full border-t-transparent border-solid border-current align-[-0.125em] ${sizeMap[size] || sizeMap.md} ${color} ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Loader;