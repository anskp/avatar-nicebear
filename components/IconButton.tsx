
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, label, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="flex flex-col items-center justify-center p-3 bg-brand-secondary text-brand-subtle rounded-lg shadow-lg hover:bg-brand-accent hover:text-brand-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-secondary disabled:hover:text-brand-subtle"
    >
      <div className="w-6 h-6">{children}</div>
      <span className="text-xs mt-1 font-semibold">{label}</span>
    </button>
  );
};

export default IconButton;
