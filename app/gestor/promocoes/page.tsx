'use client'

import { useState, useMemo } from 'react'
import { Tag, TrendingUp, Eye, EyeOff, Plus, Trash2, Download } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import SearchBar from '@/components/SearchBar/SearchBar'
import Select from '@/components/Select/Select'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import CreatePromotionModal from './components/CreatePromotionModal/CreatePromotionModal'
import LabelPreviewModal from '@/components/LabelPreviewModal/LabelPreviewModal'
import BulkLabelGenerator from '@/components/BulkLabelGenerator/BulkLabelGenerator'
import { usePromotions } from '@/hooks/usePromotions'
import { useProducts } from '@/hooks/useProducts'
import { useStores } from '@/hooks/useStores'
import styles from './page.module.css'

type ModalType = 'delete' | 'toggleVisibility' | null

export default function GestorPromocoesPage() {
  const { promotions, loading, toggleVisibility, deletePromotion, refresh } = usePromotions()
  const { products } = useProducts()
  const { stores } = useStores()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [storeFilter, setStoreFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false)
  
  const [modalState, setModalState] = useState<{ 
    type: ModalType; 
    itemId: string | null; 
    currentValue?: boolean 
  }>({ type: null, itemId: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null)

  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Promoções', href: '/gestor/promocoes', icon: 'Tag' },
    { label: 'Relatórios', href: '/gestor/relatorios', icon: 'TrendingUp' },
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

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const productName = getProductName(promotion.product_id)
      
      const searchMatch = searchTerm === '' || 
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.new_barcode.includes(searchTerm)

      const statusMatch = statusFilter === '' || 
        (statusFilter === 'active' && promotion.is_active) ||
        (statusFilter === 'inactive' && !promotion.is_active) ||
        (statusFilter === 'visible' && promotion.is_visible) ||
        (statusFilter === 'hidden' && !promotion.is_visible)

      const storeMatch = storeFilter === '' || promotion.store_id === storeFilter

      return searchMatch && statusMatch && storeMatch
    })
  }, [promotions, searchTerm, statusFilter, storeFilter, products])

  const handleOpenModal = (type: ModalType, itemId: string, currentValue?: boolean) => {
    setModalState({ type, itemId, currentValue })
  }

  const handleModalClose = () => {
    setModalState({ type: null, itemId: null })
  }

  const handleModalConfirm = async () => {
    if (!modalState.itemId || !modalState.type) return

    setIsSubmitting(true)
    try {
      if (modalState.type === 'delete') {
        await deletePromotion(modalState.itemId)
      } else if (modalState.type === 'toggleVisibility') {
        await toggleVisibility(modalState.itemId, !modalState.currentValue)
      }
    } catch (error) {
      alert('Ocorreu um erro ao executar a ação.')
    } finally {
      setIsSubmitting(false)
      handleModalClose()
    }
  }

  const handleSuccess = () => {
    refresh()
  }

  const handleViewLabel = (promotionId: string) => {
    setSelectedPromotion(promotionId)
    setIsLabelModalOpen(true)
  }

  const handleCloseLabelModal = () => {
    setIsLabelModalOpen(false)
    setSelectedPromotion(null)
  }

  const totalPromotions = filteredPromotions.length
  const activePromotions = filteredPromotions.filter((p) => p.is_active).length
  const visiblePromotions = filteredPromotions.filter((p) => p.is_visible).length
  const totalDiscount = filteredPromotions.length > 0
    ? Math.round(filteredPromotions.reduce((sum, p) => sum + p.discount, 0) / filteredPromotions.length)
    : 0

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
    { value: 'visible', label: 'Visíveis' },
    { value: 'hidden', label: 'Ocultas' },
  ]

  const storeOptions = [
    { value: '', label: 'Todas as lojas' },
    ...stores.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]

  const columns = [
    { 
      key: 'product_id', 
      label: 'Produto',
      render: (value: string) => getProductName(value)
    },
    { 
      key: 'store_id', 
      label: 'Loja',
      render: (value: string) => getStoreName(value)
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
      key: 'is_visible', 
      label: 'Visibilidade',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Visível' : 'Oculto'}
        </Badge>
      )
    },
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
      render: (value: string, row: any) => (
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => handleViewLabel(value)}>
            <Tag size={16} />
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleOpenModal('toggleVisibility', value, row.is_visible)}
          >
            {row.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button variant="danger" onClick={() => handleOpenModal('delete', value)}>
            <Trash2 size={16} />
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

  const getModalConfig = () => {
    switch (modalState.type) {
      case 'delete':
        return {
          title: 'Excluir Promoção',
          message: 'Tem certeza que deseja excluir esta promoção?',
          confirmText: 'Excluir',
          variant: 'danger' as 'danger',
        }
      case 'toggleVisibility':
        const actionText = modalState.currentValue ? 'ocultar' : 'exibir'
        return {
          title: `Alterar Visibilidade`,
          message: `Tem certeza que deseja ${actionText} esta promoção para as lojas?`,
          confirmText: modalState.currentValue ? 'Ocultar' : 'Exibir',
          variant: 'primary' as 'primary',
        }
      default:
        return { title: '', message: '', confirmText: '', variant: 'primary' as 'primary' }
    }
  }

  const modalConfig = getModalConfig()

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando promoções..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>Promoções</h1>
                  <p className={styles.subtitle}>Gerencie descontos e etiquetas</p>
                </div>
                <div className={styles.headerActions}>
                  <Button variant="secondary" onClick={() => setIsBulkModalOpen(true)}>
                    <Download size={18} />
                    Gerar em Lote
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Nova Promoção
                  </Button>
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Tag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Total de Promoções</p>
                    <h2 className={styles.statValue}>{totalPromotions}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <TrendingUp size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Promoções Ativas</p>
                    <h2 className={styles.statValue}>{activePromotions}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Eye size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Visíveis para Lojas</p>
                    <h2 className={styles.statValue}>{visiblePromotions}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Tag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Desconto Médio</p>
                    <h2 className={styles.statValue}>{totalDiscount}%</h2>
                  </div>
                </div>
              </div>

              <div className={styles.filters}>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por produto, código..."
                  fullWidth
                />
                <div className={styles.filterRow}>
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    placeholder="Filtrar por status"
                  />
                  <Select
                    value={storeFilter}
                    onChange={setStoreFilter}
                    options={storeOptions}
                    placeholder="Filtrar por loja"
                  />
                  <div className={styles.resultCount}>
                    {filteredPromotions.length} promoç{filteredPromotions.length !== 1 ? 'ões' : 'ão'} encontrada{filteredPromotions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className={styles.tableSection}>
                <Card padding="medium">
                  <Table columns={columns} data={filteredPromotions} emptyMessage="Nenhuma promoção encontrada" />
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreatePromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <BulkLabelGenerator
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        promotions={filteredPromotions}
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

      <ConfirmModal
        isOpen={modalState.type !== null}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        variant={modalConfig.variant}
        loading={isSubmitting}
      />
    </div>
  )
}