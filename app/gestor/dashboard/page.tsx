'use client'

import { useMemo } from 'react'
import { Store, Package, AlertTriangle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import StatCard from './components/StatCard/StatCard'
import CategoryCard from './components/CategoryCard/CategoryCard'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { useProducts } from '@/hooks/useProducts'
import { usePromotions } from '@/hooks/usePromotions'
import { getExpirationCategory } from '@/utils/dateHelpers'
import styles from './page.module.css'

export default function GestorDashboard() {
  const { user, logout } = useAuth()
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

    return {
      activeStores: stores.length,
      totalProducts: products.length,
      soldProducts: soldProducts.length,
      activePromotions: promotions.length,
      totalValue,
      totalRevenue,
      categories,
    }
  }, [stores, products, soldProducts, promotions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (productsLoading) {
    return <LoadingSpinner fullScreen text="Carregando dashboard..." />
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
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Visão geral do sistema</p>
              </div>

              <div className={styles.grid}>
                <StatCard
                  icon={Store}
                  label="Lojas Ativas"
                  value={stats.activeStores}
                  delay={0.1}
                />
                <StatCard
                  icon={Package}
                  label="Produtos em Estoque"
                  value={stats.totalProducts}
                  delay={0.2}
                />
                <StatCard
                  icon={TrendingUp}
                  label="Produtos Vendidos"
                  value={stats.soldProducts}
                  delay={0.3}
                />
                <StatCard
                  icon={AlertTriangle}
                  label="Promoções Ativas"
                  value={stats.activePromotions}
                  delay={0.4}
                />
                <StatCard
                  icon={DollarSign}
                  label="Valor em Estoque"
                  value={formatCurrency(stats.totalValue)}
                  delay={0.5}
                />
                <StatCard
                  icon={TrendingDown}
                  label="Receita Total"
                  value={formatCurrency(stats.totalRevenue)}
                  delay={0.6}
                />
              </div>

              <div className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>Análise Geral por Validade</h3>
                <div className={styles.categoryGrid}>
                  <CategoryCard
                    icon={AlertTriangle}
                    label="Declarar Baixa"
                    value={stats.categories.declarar}
                    description="1-15 dias"
                    variant="declarar"
                  />
                  <CategoryCard
                    icon={AlertTriangle}
                    label="Emergência"
                    value={stats.categories.emergencia}
                    description="16-29 dias"
                    variant="emergencia"
                  />
                  <CategoryCard
                    icon={AlertTriangle}
                    label="Urgente"
                    value={stats.categories.urgente}
                    description="30-59 dias"
                    variant="urgente"
                  />
                  <CategoryCard
                    icon={Package}
                    label="Pouco Urgente"
                    value={stats.categories.poucoUrgente}
                    description="60-89 dias"
                    variant="poucoUrgente"
                  />
                  <CategoryCard
                    icon={Package}
                    label="Em Análise"
                    value={stats.categories.analise}
                    description="90+ dias"
                    variant="analise"
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