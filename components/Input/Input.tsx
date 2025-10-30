import styles from './Input.module.css';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  fullWidth = false,
  required = false,
  disabled = false,
}: InputProps) {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={styles.input}
      />
    </div>
  );
}