'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import Input from '@/components/Input/Input'
import DatePicker from '@/components/DatePicker/DatePicker'
import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import Button from '@/components/Button/Button'
import { useProducts } from '@/hooks/useProducts'
import { Database } from '@/lib/supabase/types'
import styles from './EditProductModal.module.css'

type Product = Database['public']['Tables']['products']['Row']

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSuccess: () => void
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const { updateProduct } = useProducts()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    barcode: '',
    internalCode: '',
    quantity: '',
    price: '',
    expirationDate: '',
    batch: '',
  })

  const [categories, setCategories] = useState([
    { value: 'Medicamentos', label: 'Medicamentos' },
    { value: 'Higiene e Beleza', label: 'Higiene e Beleza' },
    { value: 'Suplementos', label: 'Suplementos' },
    { value: 'Higiene', label: 'Higiene' },
    { value: 'Equipamentos', label: 'Equipamentos' },
  ])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        brand: product.brand,
        barcode: product.barcode,
        internalCode: product.internal_code,
        quantity: product.quantity.toString(),
        price: product.current_price.toString(),
        expirationDate: product.expiration_date,
        batch: product.batch,
      })
    }
  }, [product])

  const handleCreateCategory = (newCategory: string) => {
    const newCategoryOption = {
      value: newCategory,
      label: newCategory,
    }
    setCategories([...categories, newCategoryOption])
    setFormData({ ...formData, category: newCategory })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setLoading(true)
    try {
      await updateProduct(product.id, {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        barcode: formData.barcode,
        internal_code: formData.internalCode,
        quantity: parseInt(formData.quantity),
        expiration_date: formData.expirationDate,
        batch: formData.batch,
        current_price: parseFloat(formData.price),
        original_price: product.original_price, 
      })
      onSuccess()
      onClose()
    } catch (error) {
      alert('Erro ao atualizar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Produto"
      size="large"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="edit-product-form"
            variant="primary" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </>
      }
    >
      <form id="edit-product-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <Input
            label="Nome do Produto"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            fullWidth
            required
            disabled={loading}
          />
          <Input
            label="Marca"
            value={formData.brand}
            onChange={(value) => setFormData({ ...formData, brand: value })}
            fullWidth
            required
            disabled={loading}
          />
        </div>

        <div className={styles.row}>
          <AutocompleteInput
            label="Categoria"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={categories}
            onCreateNew={handleCreateCategory}
            fullWidth
            required
          />
          <Input
            label="Lote"
            value={formData.batch}
            onChange={(value) => setFormData({ ...formData, batch: value })}
            fullWidth
            required
            disabled={loading}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Código de Barras"
            value={formData.barcode}
            onChange={(value) => setFormData({ ...formData, barcode: value })}
            fullWidth
            required
            disabled={loading}
          />
          <Input
            label="Código Interno"
            value={formData.internalCode}
            onChange={(value) => setFormData({ ...formData, internalCode: value })}
            fullWidth
            required
            disabled={loading}
          />
        </div>

        <div className={styles.row}>
          <Input
            type="number"
            label="Quantidade"
            value={formData.quantity}
            onChange={(value) => setFormData({ ...formData, quantity: value })}
            fullWidth
            required
            disabled={loading}
          />
          <Input
            type="number"
            label="Preço (R$)"
            value={formData.price}
            onChange={(value) => setFormData({ ...formData, price: value })}
            fullWidth
            required
            disabled={loading}
          />
        </div>

        <DatePicker
          label="Data de Validade"
          value={formData.expirationDate}
          onChange={(value) => setFormData({ ...formData, expirationDate: value })}
          fullWidth
          required
        />
      </form>
    </Modal>
  )
}