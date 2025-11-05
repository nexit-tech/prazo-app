'use client'

import { useMemo } from 'react'
import { Package, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useStores } from '@/hooks/useStores'
import { getExpirationCategory } from '@/utils/dateHelpers'
import styles from './page.module.css'

export default function LojaDashboard() {
  const { user } = useAuth()
  const { products, loading: productsLoading } = useProducts({ 
    storeId: user?.storeId || undefined,
    isSold: false 
  })
  const { products: soldProducts } = useProducts({ 
    storeId: user?.storeId || undefined,
    isSold: true 
  })
  const { stores } = useStores()

  const menuItems = [
    { label: 'Dashboard', href: '/loja/dashboard', icon: 'BarChart3' },
    { label: 'Produtos', href: '/loja/produtos', icon: 'Package' },
    { label: 'Cadastrar Produto', href: '/loja/cadastrar', icon: 'Plus' },
    { label: 'Alertas', href: '/loja/alertas', icon: 'AlertTriangle' },
    { label: 'Etiquetas', href: '/loja/etiquetas', icon: 'Tag' },
  ]

  const currentStore = useMemo(() => {
    return stores.find(s => s.id === user?.storeId)
  }, [stores, user?.storeId])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalSold = soldProducts.length
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
      totalProducts,
      totalSold,
      totalValue,
      totalRevenue,
      categories,
    }
  }, [products, soldProducts])

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
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>
                  {currentStore?.name || 'Minha Loja'} - {currentStore?.code || ''}
                </p>
              </div>

              <div className={styles.grid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Package size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Produtos em Estoque</p>
                    <h2 className={styles.statValue}>{stats.totalProducts}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <TrendingUp size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Produtos Vendidos</p>
                    <h2 className={styles.statValue}>{stats.totalSold}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <DollarSign size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Valor em Estoque</p>
                    <h2 className={styles.statValue}>
                      {formatCurrency(stats.totalValue)}
                    </h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <TrendingDown size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Receita Total</p>
                    <h2 className={styles.statValue}>
                      {formatCurrency(stats.totalRevenue)}
                    </h2>
                  </div>
                </div>
              </div>

              <div className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>Análise por Validade</h3>
                <div className={styles.categoryGrid}>
                  <div className={`${styles.categoryCard} ${styles.declarar}`}>
                    <div className={styles.categoryIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Declarar Baixa</p>
                      <h3 className={styles.categoryValue}>{stats.categories.declarar}</h3>
                      <span className={styles.categoryDescription}>1-15 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.emergencia}`}>
                    <div className={styles.categoryIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Emergência</p>
                      <h3 className={styles.categoryValue}>{stats.categories.emergencia}</h3>
                      <span className={styles.categoryDescription}>16-29 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.urgente}`}>
                    <div className={styles.categoryIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Urgente</p>
                      <h3 className={styles.categoryValue}>{stats.categories.urgente}</h3>
                      <span className={styles.categoryDescription}>30-59 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.poucoUrgente}`}>
                    <div className={styles.categoryIcon}>
                      <Package size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Pouco Urgente</p>
                      <h3 className={styles.categoryValue}>{stats.categories.poucoUrgente}</h3>
                      <span className={styles.categoryDescription}>60-89 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.analise}`}>
                    <div className={styles.categoryIcon}>
                      <Package size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Em Análise</p>
                      <h3 className={styles.categoryValue}>{stats.categories.analise}</h3>
                      <span className={styles.categoryDescription}>90+ dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}