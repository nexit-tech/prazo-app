import SalesChart from './SalesChart/SalesChart'
import CategoryChart from './CategoryChart/CategoryChart'
import styles from './ChartsSection.module.css'

interface ChartsSectionProps {
  salesData: Array<{
    date: string
    sales: number
    revenue: number
  }>
  categoryData: Array<{
    category: string
    value: number
  }>
}

export default function ChartsSection({ salesData, categoryData }: ChartsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Análises Gráficas</h2>
        <p className={styles.subtitle}>Visualização de dados e tendências</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.chart}>
          <SalesChart data={salesData} />
        </div>
        <div className={styles.chart}>
          <CategoryChart data={categoryData} />
        </div>
      </div>
    </section>
  )
}