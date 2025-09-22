import React from 'react';

const badgeVariants = {
  default: "bg-primary-500 text-white",
  secondary: "bg-gray-100 text-gray-800",
  outline: "border border-gray-300 text-gray-700 bg-white",
  destructive: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
};

export const Badge = ({ 
  children, 
  variant = "default", 
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  
  return (
    <span 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};




