'use client'

import { Check } from 'lucide-react'
import styles from './Checkbox.module.css'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  id: string
}

export default function Checkbox({
  label,
  checked,
  onChange,
  id,
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className={styles.hiddenInput}
      />
      <label htmlFor={id} className={styles.label}>
        <span className={styles.customCheckbox}>
          {checked && <Check size={14} strokeWidth={3} />}
        </span>
        {label}
      </label>
    </div>
  )
}