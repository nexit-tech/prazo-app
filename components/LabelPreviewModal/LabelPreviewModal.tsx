'use client'

import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import LabelPreview from '@/components/LabelPreview/LabelPreview'
import styles from './LabelPreviewModal.module.css'

interface LabelPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  promotion: {
    id: string
    product_id: string
    discount: number
    new_price: number
    new_barcode: string
  }
  product: {
    name: string
    brand: string
    current_price: number
    expiration_date: string
  }
  storeName: string
}

export default function LabelPreviewModal({
  isOpen,
  onClose,
  promotion,
  product,
  storeName,
}: LabelPreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pré-visualização da Etiqueta"
      size="large"
      footer={
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <div className={styles.content}>
        <LabelPreview
          promotion={promotion}
          product={product}
          storeName={storeName}
        />
      </div>
    </Modal>
  )
}