import { LucideIcon } from 'lucide-react'
import styles from './CategoryCard.module.css'

interface CategoryCardProps {
  icon: LucideIcon
  label: string
  value: number
  description: string
  variant: 'declarar' | 'emergencia' | 'urgente' | 'poucoUrgente' | 'analise'
  delay?: number
}

export default function CategoryCard({
  icon: Icon,
  label,
  value,
  description,
  variant,
  delay = 0,
}: CategoryCardProps) {
  return (
    <div 
      className={`${styles.categoryCard} ${styles[variant]}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={styles.icon}>
        <Icon size={24} />
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h3 className={styles.value}>{value}</h3>
        <span className={styles.description}>{description}</span>
      </div>
    </div>
  )
}