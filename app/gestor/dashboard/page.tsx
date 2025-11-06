'use client'

import { useMemo } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import MetricsGrid from './components/MetricsGrid/MetricsGrid'
import ExpirationAnalysis from './components/ExpirationAnalysis/ExpirationAnalysis'
import ChartsSection from './components/ChartsSection/ChartsSection'
import { useStores } from '@/hooks/useStores'
import { useProducts } from '@/hooks/useProducts'
import { usePromotions } from '@/hooks/usePromotions'
import { getExpirationCategory } from '@/utils/dateHelpers'
import styles from './page.module.css'

export default function GestorDashboard() {
  const { stores } = useStores({ isActive: true })
  const { products, loading: productsLoading } = useProducts({ isSold: false })
  const { products: soldProducts } = useProducts({ isSold: true })
  const { promotions } = usePromotions({ isActive: true })

  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Promoções', href: '/gestor/promocoes', icon: 'Tag' },
    { label: 'Relatórios', href: '/gestor/relatorios', icon: 'TrendingUp' },
  ]

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (p.current_price * p.quantity), 0)
    const totalRevenue = soldProducts.reduce((sum, p) => sum + p.current_price, 0)

    const categories = {
      declarar: 0,
      emergencia: 0,
      urgente: 0,
      poucoUrgente: 0,
      analise: 0,
    }

    products.forEach(p => {
      const category = getExpirationCategory(p.expiration_date)
      if (category === 'declarar') categories.declarar++
      else if (category === 'emergencia') categories.emergencia++
      else if (category === 'urgente') categories.urgente++
      else if (category === 'pouco-urgente') categories.poucoUrgente++
      else if (category === 'analise') categories.analise++
    })

    const salesByDate: Record<string, { sales: number; revenue: number }> = {}
    soldProducts.forEach(p => {
      if (!p.sold_at) return
      const date = new Date(p.sold_at).toISOString().split('T')[0]
      if (!salesByDate[date]) salesByDate[date] = { sales: 0, revenue: 0 }
      salesByDate[date].sales++
      salesByDate[date].revenue += p.current_price
    })

    const salesData = Object.entries(salesByDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)

    const categoryCount: Record<string, number> = {}
    soldProducts.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })

    const categoryData = Object.entries(categoryCount)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    return {
      activeStores: stores.length,
      totalProducts: products.length,
      soldProducts: soldProducts.length,
      activePromotions: promotions.length,
      totalValue,
      totalRevenue,
      categories,
      salesData,
      categoryData,
    }
  }, [stores, products, soldProducts, promotions])

  if (productsLoading) {
    return <LoadingSpinner fullScreen text="Carregando dashboard..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>Visão geral do sistema</p>
            </div>

            <MetricsGrid
              activeStores={stats.activeStores}
              totalProducts={stats.totalProducts}
              soldProducts={stats.soldProducts}
              activePromotions={stats.activePromotions}
              totalValue={stats.totalValue}
              totalRevenue={stats.totalRevenue}
            />

            <ExpirationAnalysis
              declarar={stats.categories.declarar}
              emergencia={stats.categories.emergencia}
              urgente={stats.categories.urgente}
              poucoUrgente={stats.categories.poucoUrgente}
              analise={stats.categories.analise}
            />

            <ChartsSection
              salesData={stats.salesData}
              categoryData={stats.categoryData}
            />
          </div>
        </main>
      </div>
    </div>
  )
}