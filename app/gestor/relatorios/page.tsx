'use client'

import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import MetricsCard from './components/MetricsCard/MetricsCard'
import ExpirationChart from './components/ExpirationChart/ExpirationChart'
import SalesChart from './components/SalesChart/SalesChart'
import CategoryChart from './components/CategoryChart/CategoryChart'
import ReportFilters from './components/ReportFilters/ReportFilters'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { reportsService, ReportFilters as Filters } from '@/services/reports.service'
import styles from './page.module.css'

export default function GestorRelatoriosPage() {
  const { user, logout } = useAuth()
  const { stores } = useStores()
  const [loading, setLoading] = useState(true)
  const [storeFilter, setStoreFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  const [metrics, setMetrics] = useState<any[]>([])
  const [expirationData, setExpirationData] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Promoções', href: '/gestor/promocoes', icon: 'Tag' },
    { label: 'Relatórios', href: '/gestor/relatorios', icon: 'TrendingUp' },
  ]

  const storeOptions = [
    { value: '', label: 'Todas as lojas' },
    ...stores.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]

  useEffect(() => {
    const end = new Date()
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const endDateString = end.toISOString().split('T')[0]
    const startDateString = start.toISOString().split('T')[0]
    
    setEndDate(endDateString)
    setStartDate(startDateString)

    loadReportsWithDates(startDateString, endDateString, '')
  }, [])

  const loadReportsWithDates = async (start: string, end: string, store: string) => {
    try {
      setLoading(true)

      const filters: Filters = {
        storeId: store || undefined,
        startDate: start || undefined,
        endDate: end || undefined,
      }

      const [metricsResult, expirationResult, salesResult, categoryResult] = await Promise.all([
        reportsService.getMetrics(filters),
        reportsService.getExpirationReport(filters),
        reportsService.getSalesTrend(filters),
        reportsService.getTopCategories(filters),
      ])

      setMetrics(metricsResult)
      setExpirationData(expirationResult)
      setSalesData(salesResult)
      setCategoryData(categoryResult)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    loadReportsWithDates(startDate, endDate, storeFilter)
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando relatórios..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar 
          menuItems={menuItems} 
          userName={user?.fullName || 'Gestor'} 
          userRole="Gestor" 
          onLogout={logout} 
        />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.headerIcon}>
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h1 className={styles.title}>Relatórios e Análises</h1>
                  <p className={styles.subtitle}>Visualize métricas e tendências em tempo real</p>
                </div>
              </div>

              <div className={styles.layoutGrid}>
                <div className={styles.mainContent}>
                  {metrics.length > 0 && (
                    <div className={styles.metricsGrid}>
                      {metrics.map((metric, index) => (
                        <MetricsCard key={index} metric={metric} />
                      ))}
                    </div>
                  )}

                  <div className={styles.chartsGrid}>
                    {expirationData.length > 0 && (
                      <ExpirationChart data={expirationData} />
                    )}
                    {salesData.length > 0 && (
                      <SalesChart data={salesData} />
                    )}
                    {categoryData.length > 0 && (
                      <CategoryChart data={categoryData} />
                    )}
                    
                    {expirationData.length === 0 && salesData.length === 0 && categoryData.length === 0 && (
                      <div className={styles.emptyState}>
                        <p>Nenhum dado disponível para o período selecionado</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.sidebar}>
                  <ReportFilters
                    storeFilter={storeFilter}
                    onStoreChange={setStoreFilter}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    endDate={endDate}
                    onEndDateChange={setEndDate}
                    onApplyFilters={handleApplyFilters}
                    storeOptions={storeOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}