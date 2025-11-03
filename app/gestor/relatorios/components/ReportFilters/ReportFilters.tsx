import { Calendar } from 'lucide-react'
import Select from '@/components/Select/Select'
import Button from '@/components/Button/Button'
import styles from './ReportFilters.module.css'

interface ReportFiltersProps {
  storeFilter: string
  onStoreChange: (value: string) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  onApplyFilters: () => void
  storeOptions: Array<{ value: string; label: string }>
}

export default function ReportFilters({
  storeFilter,
  onStoreChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onApplyFilters,
  storeOptions,
}: ReportFiltersProps) {
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const handleQuickFilter = (days: number) => {
    const end = new Date()
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    onStartDateChange(start.toISOString().split('T')[0])
    onEndDateChange(end.toISOString().split('T')[0])
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Calendar size={20} />
        </div>
        <div>
          <h3 className={styles.title}>Filtros de Relatório</h3>
          <p className={styles.subtitle}>Personalize o período e a loja</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <label className={styles.label}>Loja</label>
          <Select
            value={storeFilter}
            onChange={onStoreChange}
            options={storeOptions}
            placeholder="Todas as lojas"
            fullWidth
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Período</label>
          <div className={styles.dateRow}>
            <div className={styles.dateField}>
              <label className={styles.dateLabel}>Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                max={today}
                className={styles.dateInput}
              />
            </div>
            <span className={styles.dateSeparator}>até</span>
            <div className={styles.dateField}>
              <label className={styles.dateLabel}>Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                max={today}
                min={startDate}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Atalhos</label>
          <div className={styles.quickFilters}>
            <button 
              className={styles.quickButton}
              onClick={() => handleQuickFilter(7)}
            >
              Últimos 7 dias
            </button>
            <button 
              className={styles.quickButton}
              onClick={() => handleQuickFilter(30)}
            >
              Últimos 30 dias
            </button>
            <button 
              className={styles.quickButton}
              onClick={() => handleQuickFilter(90)}
            >
              Últimos 90 dias
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" onClick={onApplyFilters} fullWidth>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  )
}