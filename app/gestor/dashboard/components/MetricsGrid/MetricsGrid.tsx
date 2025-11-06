import { Store, Package, TrendingUp, AlertTriangle, DollarSign, TrendingDown } from 'lucide-react'
import MetricCard from './MetricCard/MetricCard'
import styles from './MetricsGrid.module.css'

interface MetricsGridProps {
  activeStores: number
  totalProducts: number
  soldProducts: number
  activePromotions: number
  totalValue: number
  totalRevenue: number
}

export default function MetricsGrid({
  activeStores,
  totalProducts,
  soldProducts,
  activePromotions,
  totalValue,
  totalRevenue,
}: MetricsGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <MetricCard
          icon={Store}
          label="Lojas Ativas"
          value={activeStores}
          trend="neutral"
        />
      </div>
      <div className={styles.card}>
        <MetricCard
          icon={Package}
          label="Produtos em Estoque"
          value={totalProducts}
          trend="neutral"
        />
      </div>
      <div className={styles.card}>
        <MetricCard
          icon={TrendingUp}
          label="Produtos Vendidos"
          value={soldProducts}
          trend={soldProducts > 0 ? 'up' : 'neutral'}
        />
      </div>
      <div className={styles.card}>
        <MetricCard
          icon={AlertTriangle}
          label="Promoções Ativas"
          value={activePromotions}
          trend="neutral"
        />
      </div>
      <div className={styles.card}>
        <MetricCard
          icon={DollarSign}
          label="Valor em Estoque"
          value={formatCurrency(totalValue)}
          trend="neutral"
        />
      </div>
      <div className={styles.card}>
        <MetricCard
          icon={TrendingDown}
          label="Receita Total"
          value={formatCurrency(totalRevenue)}
          trend={totalRevenue > 0 ? 'up' : 'neutral'}
        />
      </div>
    </div>
  )
}