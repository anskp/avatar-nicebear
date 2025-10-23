
import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  colors: string[];
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, colors, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-subtle mb-2">{label}</label>
      <div className="grid grid-cols-7 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-full aspect-square rounded-md border-2 transition-transform transform hover:scale-110 ${
              value === color ? 'border-brand-accent ring-2 ring-brand-accent' : 'border-transparent'
            }`}
            style={{ backgroundColor: `#${color}` }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
