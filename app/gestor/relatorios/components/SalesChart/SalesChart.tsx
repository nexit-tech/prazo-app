import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SalesData } from '@/services/reports.service'
import { formatChartDate, formatChartCurrency, chartColors } from '@/utils/chartHelpers'
import styles from './SalesChart.module.css'

interface SalesChartProps {
  data: SalesData[]
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data.map(item => ({
    date: formatChartDate(item.date),
    fullDate: item.date,
    sales: item.sales,
    revenue: item.revenue,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDate}>{payload[0].payload.fullDate}</p>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ background: chartColors.primary }}></span>
              <span className={styles.tooltipLabel}>Vendas:</span>
              <span className={styles.tooltipValue}>{payload[0].value}</span>
            </div>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipDot} style={{ background: chartColors.success }}></span>
              <span className={styles.tooltipLabel}>Receita:</span>
              <span className={styles.tooltipValue}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(payload[1].value)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tendência de Vendas</h3>
        <p className={styles.subtitle}>Vendas e receita ao longo do tempo</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis 
              dataKey="date" 
              stroke="#666666"
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#666666"
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#666666"
              style={{ fontSize: '0.75rem' }}
              tickFormatter={formatChartCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '0.875rem', paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'sales') return 'Vendas'
                if (value === 'revenue') return 'Receita'
                return value
              }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="sales" 
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ fill: chartColors.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke={chartColors.success}
              strokeWidth={2}
              dot={{ fill: chartColors.success, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}