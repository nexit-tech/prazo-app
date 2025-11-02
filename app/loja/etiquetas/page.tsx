'use client'

import { useMemo } from 'react'
import { Tag, Download, Eye, Printer } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { usePromotions } from '@/hooks/usePromotions'
import { useProducts } from '@/hooks/useProducts'
import styles from './page.module.css'

export default function LojaEtiquetasPage() {
  const { user, logout } = useAuth()
  const { promotions, loading } = usePromotions({ 
    storeId: user?.storeId || undefined,
    isVisible: true 
  })
  const { products } = useProducts()

  const menuItems = [
    { label: 'Dashboard', href: '/loja/dashboard', icon: 'BarChart3' },
    { label: 'Produtos', href: '/loja/produtos', icon: 'Package' },
    { label: 'Cadastrar Produto', href: '/loja/cadastrar', icon: 'Plus' },
    { label: 'Alertas', href: '/loja/alertas', icon: 'AlertTriangle' },
    { label: 'Etiquetas', href: '/loja/etiquetas', icon: 'Tag' },
  ]

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || 'N/A'
  }

  const stats = useMemo(() => {
    const totalLabels = promotions.length
    const activeLabels = promotions.filter((p) => p.is_active).length
    const averageDiscount = promotions.length > 0
      ? Math.round(promotions.reduce((sum, p) => sum + p.discount, 0) / promotions.length)
      : 0

    return { totalLabels, activeLabels, averageDiscount }
  }, [promotions])

  const handleDownload = (promotionId: string) => {
    alert('Funcionalidade de download será implementada em breve')
  }

  const handlePrint = (promotionId: string) => {
    alert('Funcionalidade de impressão será implementada em breve')
  }

  const columns = [
    { 
      key: 'product_id', 
      label: 'Produto',
      render: (value: string) => getProductName(value)
    },
    { 
      key: 'discount', 
      label: 'Desconto',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'new_price', 
      label: 'Novo Preço',
      render: (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },
    { key: 'new_barcode', label: 'Novo Código' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Ativa' : 'Inativa'}
        </Badge>
      )
    },
    {
      key: 'id',
      label: 'Ações',
      render: (value: string) => (
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => handleDownload(value)}>
            <Download size={16} />
          </Button>
          <Button variant="secondary" onClick={() => handlePrint(value)}>
            <Printer size={16} />
          </Button>
        </div>
      )
    },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando etiquetas..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar 
          menuItems={menuItems} 
          userName={user?.fullName || 'Loja'} 
          userRole="Loja" 
          onLogout={logout} 
        />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <h1 className={styles.title}>Etiquetas</h1>
                <p className={styles.subtitle}>Baixe e imprima etiquetas de promoção</p>
              </div>

              <div className={styles.grid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Tag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Total de Etiquetas</p>
                    <h2 className={styles.statValue}>{stats.totalLabels}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Eye size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Etiquetas Ativas</p>
                    <h2 className={styles.statValue}>{stats.activeLabels}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Download size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Desconto Médio</p>
                    <h2 className={styles.statValue}>{stats.averageDiscount}%</h2>
                  </div>
                </div>
              </div>

              <Card padding="medium">
                <Table 
                  columns={columns} 
                  data={promotions} 
                  emptyMessage="Nenhuma etiqueta disponível" 
                />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}