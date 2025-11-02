import { LucideIcon } from 'lucide-react'
import styles from './StatCard.module.css'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  delay?: number
}

export default function StatCard({ icon: Icon, label, value, delay = 0 }: StatCardProps) {
  return (
    <div className={styles.statCard} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.iconWrapper}>
        <Icon size={24} />
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h2 className={styles.value}>{value}</h2>
      </div>
    </div>
  )
}