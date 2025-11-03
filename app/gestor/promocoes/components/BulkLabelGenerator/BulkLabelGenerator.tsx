import { useState } from 'react'
import { Download, Loader } from 'lucide-react'
import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import { labelGenerator } from '@/utils/labelGenerator'
import styles from './BulkLabelGenerator.module.css'

interface BulkLabelGeneratorProps {
  isOpen: boolean
  onClose: () => void
  promotions: Array<{
    id: string
    product_id: string
    discount: number
    new_price: number
    new_barcode: string
    store_id: string
  }>
  getProductById: (productId: string) => any
  getStoreName: (storeId: string) => string
}

export default function BulkLabelGenerator({
  isOpen,
  onClose,
  promotions,
  getProductById,
  getStoreName,
}: BulkLabelGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([])

  const handleTogglePromotion = (promotionId: string) => {
    setSelectedPromotions(prev => {
      if (prev.includes(promotionId)) {
        return prev.filter(id => id !== promotionId)
      }
      return [...prev, promotionId]
    })
  }

  const handleToggleAll = () => {
    if (selectedPromotions.length === promotions.length) {
      setSelectedPromotions([])
    } else {
      setSelectedPromotions(promotions.map(p => p.id))
    }
  }

  const handleGenerate = async () => {
    if (selectedPromotions.length === 0) {
      alert('Selecione pelo menos uma promoção')
      return
    }

    try {
      setLoading(true)

      const labelsData = selectedPromotions
        .map(promotionId => {
          const promotion = promotions.find(p => p.id === promotionId)
          if (!promotion) return null

          const product = getProductById(promotion.product_id)
          if (!product) return null

          return {
            productName: product.name,
            brand: product.brand,
            originalPrice: product.current_price,
            newPrice: promotion.new_price,
            discount: promotion.discount,
            newBarcode: promotion.new_barcode,
            expirationDate: product.expiration_date,
            storeName: getStoreName(product.store_id),
          }
        })
        .filter(Boolean) as any[]

      if (labelsData.length === 0) {
        alert('Nenhuma etiqueta válida para gerar')
        return
      }

      const blob = await labelGenerator.generateMultipleLabels(labelsData)
      const filename = `etiquetas-lote-${Date.now()}.pdf`
      labelGenerator.downloadLabel(blob, filename)

      handleClose()
    } catch (error) {
      alert('Erro ao gerar etiquetas em lote')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedPromotions([])
    onClose()
  }

  const isConfirmed = selectedPromotions.length > 0

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Gerar Etiquetas em Lote"
      size="large"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleGenerate}
            disabled={!isConfirmed || loading}
          >
            {loading ? (
              <>
                <Loader size={18} className={styles.spinner} />
                Gerando...
              </>
            ) : (
              <>
                <Download size={18} />
                Gerar {selectedPromotions.length} Etiqueta{selectedPromotions.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.infoText}>
            Selecione as promoções para gerar etiquetas em um único arquivo PDF (formato A4)
          </p>
        </div>

        <div className={styles.selectAll}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedPromotions.length === promotions.length}
              onChange={handleToggleAll}
              className={styles.checkbox}
            />
            <span>Selecionar todas ({promotions.length})</span>
          </label>
        </div>

        <div className={styles.promotionsList}>
          {promotions.map(promotion => {
            const product = getProductById(promotion.product_id)
            if (!product) return null

            const isSelected = selectedPromotions.includes(promotion.id)

            return (
              <div 
                key={promotion.id} 
                className={`${styles.promotionItem} ${isSelected ? styles.selected : ''}`}
              >
                <label className={styles.promotionLabel}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTogglePromotion(promotion.id)}
                    className={styles.checkbox}
                  />
                  <div className={styles.promotionDetails}>
                    <div className={styles.promotionInfo}>
                      <span className={styles.productName}>{product.name}</span>
                      <span className={styles.brand}>{product.brand}</span>
                    </div>
                    <div className={styles.promotionPrice}>
                      <span className={styles.discount}>-{promotion.discount}%</span>
                      <span className={styles.newPrice}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(promotion.new_price)}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            )
          })}
        </div>

        {promotions.length === 0 && (
          <div className={styles.empty}>
            <p>Nenhuma promoção disponível</p>
          </div>
        )}
      </div>
    </Modal>
  )
}