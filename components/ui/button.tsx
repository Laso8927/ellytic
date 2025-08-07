import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Button({ children, size = 'md', className = '', onClick }: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
} 