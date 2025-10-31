'use client';

import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  fullWidth = false,
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      <Search className={styles.searchIcon} size={18} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" onClick={handleClear} className={styles.clearButton}>
          <X size={18} />
        </button>
      )}
    </div>
  );
}