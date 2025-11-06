import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Package } from 'lucide-react'
import styles from './CategoryChart.module.css'

interface CategoryChartProps {
  data: Array<{
    category: string
    value: number
  }>
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Top Categorias</h3>
          <p className={styles.subtitle}>Categorias mais vendidas</p>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Package size={32} />
          </div>
          <p className={styles.emptyText}>Sem dados de categorias no período</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top Categorias</h3>
        <p className={styles.subtitle}>Categorias mais vendidas</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis 
              type="number" 
              stroke="#6c757d"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              stroke="#6c757d"
              style={{ fontSize: '12px' }}
              width={120}
            />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill="#0d6efd"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}