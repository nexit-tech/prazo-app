'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Package, Trash2, ShoppingCart } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { formatDaysRemaining, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers'
import styles from './page.module.css'

type ModalType = 'sell' | 'delete' | null

export default function LojaAlertasPage() {
  const { user } = useAuth()
  const { products, loading, deleteProduct, markAsSold } = useProducts({ 
    storeId: user?.storeId || undefined,
    isSold: false 
  })

  const [modalState, setModalState] = useState<{ type: ModalType; productId: string | null }>({
    type: null,
    productId: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const menuItems = [
    { label: 'Dashboard', href: '/loja/dashboard', icon: 'BarChart3' },
    { label: 'Produtos', href: '/loja/produtos', icon: 'Package' },
    { label: 'Cadastrar Produto', href: '/loja/cadastrar', icon: 'Plus' },
    { label: 'Alertas', href: '/loja/alertas', icon: 'AlertTriangle' },
    { label: 'Etiquetas', href: '/loja/etiquetas', icon: 'Tag' },
  ]

  const criticalProducts = useMemo(() => {
    return products.filter((p) => {
      const category = getExpirationCategory(p.expiration_date)
      return category === 'declarar' || category === 'emergencia' || category === 'urgente'
    })
  }, [products])

  const stats = useMemo(() => {
    const declarar = criticalProducts.filter((p) => getExpirationCategory(p.expiration_date) === 'declarar').length
    const emergencia = criticalProducts.filter((p) => getExpirationCategory(p.expiration_date) === 'emergencia').length
    const urgente = criticalProducts.filter((p) => getExpirationCategory(p.expiration_date) === 'urgente').length

    return { declarar, emergencia, urgente }
  }, [criticalProducts])

  const handleModalClose = () => {
    setModalState({ type: null, productId: null })
  }

  const handleModalConfirm = async () => {
    if (!modalState.productId || !modalState.type) return

    setIsSubmitting(true)
    try {
      if (modalState.type === 'delete') {
        await deleteProduct(modalState.productId)
      } else if (modalState.type === 'sell') {
        await markAsSold(modalState.productId)
      }
    } catch (error) {
      alert(`Erro ao ${modalState.type === 'delete' ? 'declarar baixa' : 'vender'} produto`)
    } finally {
      setIsSubmitting(false)
      handleModalClose()
    }
  }

  const columns = [
    { key: 'name', label: 'Produto' },
    { key: 'brand', label: 'Marca' },
    { key: 'quantity', label: 'Quantidade' },
    { 
      key: 'current_price', 
      label: 'Preço',
      render: (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },
    { 
      key: 'expiration_date', 
      label: 'Validade',
      render: (value: string) => formatDaysRemaining(value)
    },
    { 
      key: 'expiration_date', 
      label: 'Status',
      render: (value: string) => {
        const category = getExpirationCategory(value)
        const label = getExpirationLabel(category)
        const variant = getExpirationBadgeVariant(category)
        return <Badge variant={variant}>{label}</Badge>
      }
    },
    {
      key: 'id',
      label: 'Ações',
      render: (value: string) => (
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => setModalState({ type: 'sell', productId: value })}>
            <ShoppingCart size={16} />
          </Button>
          <Button variant="danger" onClick={() => setModalState({ type: 'delete', productId: value })}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando alertas..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Alertas</h1>
              <p className={styles.subtitle}>Produtos que necessitam atenção</p>
            </div>

            <div className={styles.grid}>
              <div className={`${styles.alertCard} ${styles.declarar}`}>
                <div className={styles.alertIcon}>
                  <AlertTriangle size={24} />
                </div>
                <div className={styles.alertContent}>
                  <p className={styles.alertLabel}>Declarar Baixa</p>
                  <h3 className={styles.alertValue}>{stats.declarar}</h3>
                  <span className={styles.alertDescription}>1-15 dias</span>
                </div>
              </div>

              <div className={`${styles.alertCard} ${styles.emergencia}`}>
                <div className={styles.alertIcon}>
                  <AlertTriangle size={24} />
                </div>
                <div className={styles.alertContent}>
                  <p className={styles.alertLabel}>Emergência</p>
                  <h3 className={styles.alertValue}>{stats.emergencia}</h3>
                  <span className={styles.alertDescription}>16-29 dias</span>
                </div>
              </div>

              <div className={`${styles.alertCard} ${styles.urgente}`}>
                <div className={styles.alertIcon}>
                  <AlertTriangle size={24} />
                </div>
                <div className={styles.alertContent}>
                  <p className={styles.alertLabel}>Urgente</p>
                  <h3 className={styles.alertValue}>{stats.urgente}</h3>
                  <span className={styles.alertDescription}>30-59 dias</span>
                </div>
              </div>
            </div>

            <Card padding="medium">
              <Table 
                columns={columns} 
                data={criticalProducts} 
                emptyMessage="Nenhum produto em alerta" 
              />
            </Card>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={modalState.type !== null}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={
          modalState.type === 'sell' 
            ? 'Confirmar Venda' 
            : 'Declarar Baixa de Produto'
        }
        message={
          modalState.type === 'sell' 
            ? 'Confirmar venda deste produto?' 
            : 'Tem certeza que deseja declarar baixa deste produto?'
        }
        confirmText={modalState.type === 'sell' ? 'Confirmar' : 'Declarar Baixa'}
        variant={modalState.type === 'sell' ? 'primary' : 'danger'}
        loading={isSubmitting}
      />
    </div>
  )
}