import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { ExpirationData } from '@/services/reports.service'
import { expirationColors } from '@/utils/chartHelpers'
import styles from './ExpirationChart.module.css'

interface ExpirationChartProps {
  data: ExpirationData[]
}

export default function ExpirationChart({ data }: ExpirationChartProps) {
  const chartData = data.map(item => ({
    name: item.category,
    value: item.count,
    percentage: item.percentage,
  }))

  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage}%`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>
            {payload[0].value} produto{payload[0].value !== 1 ? 's' : ''} ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Produtos por Status de Validade</h3>
        <p className={styles.subtitle}>Distribuição de produtos em estoque</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={expirationColors[entry.name as keyof typeof expirationColors]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className={styles.legendText}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}