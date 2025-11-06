'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  Store, 
  DollarSign, 
  Calendar, 
  ClipboardList
} from 'lucide-react'
import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import Badge from '@/components/Badge/Badge'
import { useStores } from '@/hooks/useStores'
import { productsService } from '@/services/products.service'
import { Database } from '@/lib/supabase/types'
import { 
  formatDate, 
  formatDaysRemaining, 
  getExpirationCategory, 
  getExpirationLabel,
  getExpirationBadgeVariant 
} from '@/utils/dateHelpers'
import styles from './ViewProductModal.module.css'

type Product = Database['public']['Tables']['products']['Row']

interface ViewProductModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string | null
}

export default function ViewProductModal({
  isOpen,
  onClose,
  productId,
}: ViewProductModalProps) {
  const { stores } = useStores()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct()
    }
  }, [isOpen, productId])

  const loadProduct = async () => {
    if (!productId) return
    try {
      setLoading(true)
      const data = await productsService.getById(productId)
      setProduct(data)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStoreName = (storeId: string) => {
    return stores.find((s) => s.id === storeId)?.name || 'N/A'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const handleClose = () => {
    setProduct(null)
    onClose()
  }

  const category = product ? getExpirationCategory(product.expiration_date) : 'analise'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Detalhes do Produto"
      size="large"
      footer={<Button variant="outline" onClick={handleClose}>Fechar</Button>}
    >
      {loading ? (
        <LoadingSpinner size="medium" />
      ) : product ? (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}><Package size={18} />Informações Básicas</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label className={styles.label}>Nome</label><p className={styles.value}>{product.name}</p></div>
              <div className={styles.field}><label className={styles.label}>Marca</label><p className={styles.value}>{product.brand}</p></div>
              <div className={styles.field}><label className={styles.label}>Categoria</label><p className={styles.value}>{product.category}</p></div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}><ClipboardList size={18} />Códigos e Lote</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label className={styles.label}>Código de Barras</label><p className={styles.value}>{product.barcode}</p></div>
              <div className={styles.field}><label className={styles.label}>Código Interno</label><p className={styles.value}>{product.internal_code}</p></div>
              <div className={styles.field}><label className={styles.label}>Lote</label><p className={styles.value}>{product.batch}</p></div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}><DollarSign size={18} />Valores e Estoque</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label className={styles.label}>Preço Original</label><p className={styles.value}>{formatCurrency(product.original_price)}</p></div>
              <div className={styles.field}><label className={styles.label}>Preço Atual</label><p className={styles.value}>{formatCurrency(product.current_price)}</p></div>
              <div className={styles.field}><label className={styles.label}>Quantidade</label><p className={styles.value}>{product.quantity}</p></div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}><Calendar size={18} />Validade e Status</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label className={styles.label}>Data de Validade</label><p className={styles.value}>{formatDate(product.expiration_date)}</p></div>
              <div className={styles.field}><label className={styles.label}>Tempo Restante</label><p className={styles.value}>{formatDaysRemaining(product.expiration_date)}</p></div>
              <div className={styles.field}><label className={styles.label}>Status</label><p className={styles.value}><Badge variant={getExpirationBadgeVariant(category)}>{getExpirationLabel(category)}</Badge></p></div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}><Store size={18} />Localização</h3>
            <div className={styles.grid}>
              <div className={styles.fieldFull}><label className={styles.label}>Loja</label><p className={styles.value}>{getStoreName(product.store_id)}</p></div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.error}><p>Erro ao carregar informações do produto.</p></div>
      )}
    </Modal>
  )
}