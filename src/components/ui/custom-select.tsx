"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: number;
  label: string;
}

interface CustomSelectProps {
  value: number;
  options: Option[];
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function CustomSelect({
  value,
  options,
  onChange,
  disabled = false,
  className = "",
  placeholder = "Select..."
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState<'down' | 'up'>('down');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      if (!isOpen && triggerRef.current) {
        // Calculate space available below and above
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = options.length * 40 + 16; // Approximate height
        
        // Determine drop direction based on available space
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setDropDirection('up');
        } else {
          setDropDirection('down');
        }
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          cursor-pointer bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-1 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-between min-w-[60px]
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`
            absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50
            ${dropDirection === 'up' 
              ? 'bottom-full mb-1' 
              : 'top-full mt-1'
            }
          `}
        >
          <ul className="py-1" role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className={`
                  px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors
                  ${value === option.value ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-900'}
                `}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}