import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CategoryData } from '@/services/reports.service'
import { chartColors } from '@/utils/chartHelpers'
import styles from './CategoryChart.module.css'

interface CategoryChartProps {
  data: CategoryData[]
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: index % 2 === 0 ? chartColors.primary : chartColors.secondary,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].payload.category}</p>
          <p className={styles.tooltipValue}>
            {payload[0].value} produto{payload[0].value !== 1 ? 's' : ''} vendido{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top 10 Categorias Mais Vendidas</h3>
        <p className={styles.subtitle}>Categorias com maior volume de vendas</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis 
              type="number" 
              stroke="#666666"
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              stroke="#666666"
              style={{ fontSize: '0.75rem' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}