import { LucideIcon } from 'lucide-react'
import styles from './MetricCard.module.css'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
}: MetricCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.content}>
          <p className={styles.label}>{label}</p>
          <h3 className={styles.value}>{value}</h3>
          {trend && trendValue && (
            <div className={`${styles.trend} ${styles[`trend${trend.charAt(0).toUpperCase() + trend.slice(1)}`]}`}>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={styles.iconWrapper}>
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}