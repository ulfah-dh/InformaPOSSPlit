import React from 'react';
import { formatPoints, formatRupiah, parseRupiahInput } from '../utils/currency';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  isCurrency?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  isCurrency = true,
  placeholder = "0",
  icon,
  helperText
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseRupiahInput(e.target.value);
    onChange(isNaN(val) ? 0 : val);
  };

  const displayValue = value === 0 ? '' : isCurrency ? formatPoints(value) : formatPoints(value);

  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-[#0f4372] mb-2 tracking-wide">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm transition-all duration-200 group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#648aa3]">
            {icon}
          </div>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={`block w-full rounded-lg border border-gray-300 pl-10 pr-12 py-3.5 
            focus:border-[#e55541] focus:ring-1 focus:ring-[#e55541] focus:outline-none
            sm:text-lg font-mono bg-white shadow-sm transition-colors
            ${value > 0 ? 'text-[#0f4372] font-semibold' : 'text-gray-400'}`}
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-400 font-medium sm:text-sm">
            {isCurrency ? 'IDR' : 'pts'}
          </span>
        </div>
      </div>
      {helperText && isCurrency && value > 0 && (
        <p className="mt-1.5 text-sm text-[#e55541] text-right font-semibold tracking-tight">
          {formatRupiah(value)}
        </p>
      )}
      {helperText && !isCurrency && (
        <p className="mt-1.5 text-xs text-[#648aa3] font-medium">{helperText}</p>
      )}
    </div>
  );
};