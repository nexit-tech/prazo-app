'use client'

import { useMemo, useState } from 'react'
import { Tag, Download, Eye, Printer, Plus } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import LabelPreviewModal from '@/components/LabelPreviewModal/LabelPreviewModal'
import BulkLabelGenerator from '@/components/BulkLabelGenerator/BulkLabelGenerator'
import { useAuth } from '@/hooks/useAuth'
import { usePromotions } from '@/hooks/usePromotions'
import { useProducts } from '@/hooks/useProducts'
import { useStores } from '@/hooks/useStores'
import styles from './page.module.css'

export default function LojaEtiquetasPage() {
  const { user } = useAuth()
  const { promotions, loading } = usePromotions({ 
    storeId: user?.storeId || undefined,
    isVisible: true 
  })
  const { products } = useProducts()
  const { stores } = useStores()
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null)

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
  
  const getProductById = (productId: string) => {
    return products.find((p) => p.id === productId)
  }

  const getStoreName = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId)
    return store?.name || 'N/A'
  }

  const stats = useMemo(() => {
    const totalLabels = promotions.length
    const activeLabels = promotions.filter((p) => p.is_active).length
    const averageDiscount = promotions.length > 0
      ? Math.round(promotions.reduce((sum, p) => sum + p.discount, 0) / promotions.length)
      : 0

    return { totalLabels, activeLabels, averageDiscount }
  }, [promotions])

  const handleViewLabel = (promotionId: string) => {
    setSelectedPromotion(promotionId)
    setIsLabelModalOpen(true)
  }

  const handleCloseLabelModal = () => {
    setIsLabelModalOpen(false)
    setSelectedPromotion(null)
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
          <Button variant="primary" onClick={() => handleViewLabel(value)}>
            <Tag size={16} />
          </Button>
        </div>
      )
    },
  ]

  const selectedPromotionData = useMemo(() => {
    if (!selectedPromotion) return null
    const promotion = promotions.find(p => p.id === selectedPromotion)
    if (!promotion) return null
    const product = getProductById(promotion.product_id)
    if (!product) return null
    return { promotion, product }
  }, [selectedPromotion, promotions, products])

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando etiquetas..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>Etiquetas</h1>
                <p className={styles.subtitle}>Baixe e imprima etiquetas de promoção</p>
              </div>
              <div className={styles.headerActions}>
                <Button variant="primary" onClick={() => setIsBulkModalOpen(true)}>
                  <Download size={18} />
                  Gerar em Lote
                </Button>
              </div>
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

            <div className={styles.tableSection}>
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

      <BulkLabelGenerator
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        promotions={promotions}
        getProductById={getProductById}
        getStoreName={getStoreName}
      />

      {selectedPromotionData && (
        <LabelPreviewModal
          isOpen={isLabelModalOpen}
          onClose={handleCloseLabelModal}
          promotion={selectedPromotionData.promotion}
          product={selectedPromotionData.product}
          storeName={getStoreName(selectedPromotionData.promotion.store_id)}
        />
      )}
    </div>
  )
}