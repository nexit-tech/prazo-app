import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp } from 'lucide-react'
import styles from './SalesChart.module.css'

interface SalesChartProps {
  data: Array<{
    date: string
    sales: number
    revenue: number
  }>
}

export default function SalesChart({ data }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Evolução de Vendas</h3>
          <p className={styles.subtitle}>Vendas e receita ao longo do tempo</p>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <TrendingUp size={32} />
          </div>
          <p className={styles.emptyText}>Sem dados de vendas no período</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Evolução de Vendas</h3>
        <p className={styles.subtitle}>Vendas e receita ao longo do tempo</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis 
              dataKey="date" 
              stroke="#6c757d"
              style={{ fontSize: '12px' }}
              tickFormatter={formatDate}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6c757d"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6c757d"
              style={{ fontSize: '12px' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="sales" 
              stroke="#0d6efd"
              strokeWidth={3}
              dot={{ fill: '#0d6efd', r: 4 }}
              name="Vendas"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#198754"
              strokeWidth={3}
              dot={{ fill: '#198754', r: 4 }}
              name="Receita"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}