'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import styles from './AutocompleteInput.module.css';

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  onCreateNew?: (value: string) => void;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export default function AutocompleteInput({
  label,
  value,
  onChange,
  options,
  onCreateNew,
  required = false,
  fullWidth = false,
  placeholder = 'Digite para buscar ou criar...',
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelect = (optionValue: string) => {
    setInputValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    if (inputValue.trim() && onCreateNew) {
      onCreateNew(inputValue.trim());
      setIsOpen(false);
    }
  };

  const exactMatch = options.some(
    (opt) => opt.value.toLowerCase() === inputValue.toLowerCase()
  );

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
      
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
        />

        {isOpen && (inputValue.trim() || filteredOptions.length > 0) && (
          <div className={styles.dropdown}>
            <div className={styles.optionsList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
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
                ))
              ) : (
                <div className={styles.noResults}>Nenhuma categoria encontrada</div>
              )}
              
              {inputValue.trim() && !exactMatch && onCreateNew && (
                <button
                  type="button"
                  className={styles.createOption}
                  onClick={handleCreateNew}
                >
                  <Plus size={16} />
                  <span>Criar "{inputValue}"</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}