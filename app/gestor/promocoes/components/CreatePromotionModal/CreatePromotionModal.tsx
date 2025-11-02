'use client'

import { useState, useEffect, useMemo } from 'react'
import Modal from '@/components/Modal/Modal'
import Input from '@/components/Input/Input'
import Select from '@/components/Select/Select'
import Button from '@/components/Button/Button'
import { useProducts } from '@/hooks/useProducts'
import { useStores } from '@/hooks/useStores'
import { usePromotions } from '@/hooks/usePromotions'
import { useAuth } from '@/hooks/useAuth'
import styles from './CreatePromotionModal.module.css'

interface CreatePromotionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreatePromotionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePromotionModalProps) {
  const { user } = useAuth()
  const { products } = useProducts({ isSold: false })
  const { stores } = useStores()
  const { createPromotion } = usePromotions()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    productId: '',
    storeId: '',
    discount: '',
  })

  const [calculatedPrice, setCalculatedPrice] = useState(0)

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === formData.productId)
  }, [products, formData.productId])

  const productOptions = useMemo(() => {
    return products.map((p) => ({
      value: p.id,
      label: `${p.name} - ${p.brand} (${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(p.current_price)})`,
    }))
  }, [products])

  const storeOptions = useMemo(() => {
    return stores.map((s) => ({
      value: s.id,
      label: s.name,
    }))
  }, [stores])

  useEffect(() => {
    if (selectedProduct && formData.discount) {
      const discountValue = parseFloat(formData.discount)
      const newPrice = selectedProduct.current_price * (1 - discountValue / 100)
      setCalculatedPrice(newPrice)
    } else {
      setCalculatedPrice(0)
    }
  }, [selectedProduct, formData.discount])

  const handleSubmit = async () => {
    if (!selectedProduct || !user) return

    const newBarcode = `PROMO${Date.now()}`
    const newInternalCode = `${selectedProduct.internal_code}-P${formData.discount}`

    const endDate = new Date(selectedProduct.expiration_date)
    endDate.setDate(endDate.getDate() - 2)

    try {
      setLoading(true)
      await createPromotion({
        product_id: formData.productId,
        store_id: formData.storeId,
        discount: parseFloat(formData.discount),
        new_price: calculatedPrice,
        new_barcode: newBarcode,
        new_internal_code: newInternalCode,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        is_visible: true,
        is_active: true,
        created_by: user.id,
      })
      onSuccess()
      handleClose()
    } catch (error) {
      alert('Erro ao criar promoção. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      productId: '',
      storeId: '',
      discount: '',
    })
    setCalculatedPrice(0)
    onClose()
  }

  const isValid = Boolean(formData.productId && formData.storeId && formData.discount)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Nova Promoção"
      size="large"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? 'Criando...' : 'Criar Promoção'}
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.infoBox}>
          Selecione um produto e defina o desconto para criar uma promoção
        </div>

        <Select
          label="Produto"
          value={formData.productId}
          onChange={(value) => setFormData({ ...formData, productId: value })}
          options={productOptions}
          placeholder="Selecione um produto"
          required
          fullWidth
        />

        <div className={styles.row}>
          <Select
            label="Loja"
            value={formData.storeId}
            onChange={(value) => setFormData({ ...formData, storeId: value })}
            options={storeOptions}
            placeholder="Selecione uma loja"
            required
            fullWidth
          />

          <Input
            type="number"
            label="Desconto (%)"
            placeholder="Ex: 20"
            value={formData.discount}
            onChange={(value) => setFormData({ ...formData, discount: value })}
            required
            fullWidth
          />
        </div>

        {selectedProduct && formData.discount && (
          <div className={styles.pricePreview}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Preço Original:</span>
              <span className={`${styles.priceValue} ${styles.oldPrice}`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(selectedProduct.current_price)}
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Desconto:</span>
              <span className={styles.priceValue}>-{formData.discount}%</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Novo Preço:</span>
              <span className={styles.newPrice}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(calculatedPrice)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}