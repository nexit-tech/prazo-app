'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Input from '@/components/Input/Input'
import DatePicker from '@/components/DatePicker/DatePicker'
import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import Button from '@/components/Button/Button'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import styles from './page.module.css'

export default function LojaCadastrarPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createProduct } = useProducts()
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState([
    { value: 'Medicamentos', label: 'Medicamentos' },
    { value: 'Higiene e Beleza', label: 'Higiene e Beleza' },
    { value: 'Suplementos', label: 'Suplementos' },
    { value: 'Higiene', label: 'Higiene' },
    { value: 'Equipamentos', label: 'Equipamentos' },
  ])

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

  const menuItems = [
    { label: 'Dashboard', href: '/loja/dashboard', icon: 'BarChart3' },
    { label: 'Produtos', href: '/loja/produtos', icon: 'Package' },
    { label: 'Cadastrar Produto', href: '/loja/cadastrar', icon: 'Plus' },
    { label: 'Alertas', href: '/loja/alertas', icon: 'AlertTriangle' },
    { label: 'Etiquetas', href: '/loja/etiquetas', icon: 'Tag' },
  ]

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

    if (!user?.storeId) {
      alert('Erro: Loja não identificada')
      return
    }

    try {
      setLoading(true)
      
      await createProduct({
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        barcode: formData.barcode,
        internal_code: formData.internalCode,
        quantity: parseInt(formData.quantity),
        expiration_date: formData.expirationDate,
        batch: formData.batch,
        original_price: parseFloat(formData.price),
        current_price: parseFloat(formData.price),
        store_id: user.storeId,
        is_sold: false,
      })

      alert('Produto cadastrado com sucesso!')
      router.push('/loja/produtos')
    } catch (error) {
      alert('Erro ao cadastrar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <h1 className={styles.title}>Cadastrar Produto</h1>
                <p className={styles.subtitle}>Adicione um novo produto ao estoque</p>
              </div>

              <Card padding="large">
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.row}>
                    <Input
                      label="Nome do Produto"
                      placeholder="Ex: Dipirona 500mg 20 comprimidos"
                      value={formData.name}
                      onChange={(value) => setFormData({ ...formData, name: value })}
                      fullWidth
                      required
                      disabled={loading}
                    />
                    <Input
                      label="Marca"
                      placeholder="Ex: Genérico"
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
                      placeholder="Digite ou selecione uma categoria"
                      value={formData.category}
                      onChange={(value) => setFormData({ ...formData, category: value })}
                      options={categories}
                      onCreateNew={handleCreateCategory}
                      fullWidth
                      required
                    />
                    <Input
                      label="Lote"
                      placeholder="Ex: LT20251105A"
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
                      placeholder="Ex: 7891234567001"
                      value={formData.barcode}
                      onChange={(value) => setFormData({ ...formData, barcode: value })}
                      fullWidth
                      required
                      disabled={loading}
                    />
                    <Input
                      label="Código Interno"
                      placeholder="Ex: MED001"
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
                      placeholder="Ex: 15"
                      value={formData.quantity}
                      onChange={(value) => setFormData({ ...formData, quantity: value })}
                      fullWidth
                      required
                      disabled={loading}
                    />
                    <Input
                      type="number"
                      label="Preço (R$)"
                      placeholder="Ex: 8.90"
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
                    min={today}
                    fullWidth
                    required
                  />

                  <div className={styles.buttonGroup}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}