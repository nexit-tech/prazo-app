'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  required = false,
  fullWidth = false,
  placeholder = 'Selecione...',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div 
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}
      ref={containerRef}
    >
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.selectWrapper}>
        <button
          type="button"
          className={`${styles.selectButton} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? styles.selectedText : styles.placeholderText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
            size={18} 
          />
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.optionsList}>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.option} ${
                    option.value === value ? styles.optionSelected : ''
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}