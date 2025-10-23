
import React from 'react';

interface TraitSelectorProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const TraitSelector: React.FC<TraitSelectorProps> = ({ label, value, options, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-subtle mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-brand-primary border border-gray-600 rounded-md shadow-sm py-2 px-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TraitSelector;
