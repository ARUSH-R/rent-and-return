import React from "react";
import { cn } from "../../utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  if (asChild) {
    return React.cloneElement(children, {
      className: cn(baseStyles, variants[variant], sizes[size], className, children.props.className),
      ref,
      ...props
    });
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
