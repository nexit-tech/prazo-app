import { LucideIcon } from 'lucide-react'
import styles from './ExpirationCard.module.css'

interface ExpirationCardProps {
  icon: LucideIcon
  label: string
  value: number
  description: string
  variant: 'declarar' | 'emergencia' | 'urgente' | 'poucoUrgente' | 'analise'
}

export default function ExpirationCard({
  icon: Icon,
  label,
  value,
  description,
  variant,
}: ExpirationCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconWrapper}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
      <span className={styles.description}>{description}</span>
    </div>
  )
}