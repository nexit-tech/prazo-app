import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MetricData } from '@/services/reports.service'
import styles from './MetricsCard.module.css'

interface MetricsCardProps {
  metric: MetricData
}

export default function MetricsCard({ metric }: MetricsCardProps) {
  const getTrendIcon = () => {
    if (metric.trend === 'up') {
      return <TrendingUp size={20} className={styles.trendUp} />
    }
    if (metric.trend === 'down') {
      return <TrendingDown size={20} className={styles.trendDown} />
    }
    return <Minus size={20} className={styles.trendNeutral} />
  }

  const getTrendClass = () => {
    if (metric.trend === 'up') return styles.up
    if (metric.trend === 'down') return styles.down
    return styles.neutral
  }

  return (
    <div className={`${styles.card} ${getTrendClass()}`}>
      <div className={styles.header}>
        <span className={styles.label}>{metric.label}</span>
        {metric.trend && (
          <div className={styles.trendIcon}>
            {getTrendIcon()}
          </div>
        )}
      </div>
      <div className={styles.value}>{metric.value}</div>
      {metric.change !== undefined && (
        <div className={styles.change}>
          {metric.change > 0 ? '+' : ''}{metric.change}% vs período anterior
        </div>
      )}
    </div>
  )
}