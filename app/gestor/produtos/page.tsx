'use client'

import { useState, useMemo } from 'react'
import { Eye } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import SearchBar from '@/components/SearchBar/SearchBar'
import Select from '@/components/Select/Select'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { useStores } from '@/hooks/useStores'
import { formatDaysRemaining, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers'
import styles from './page.module.css'

export default function GestorProdutosPage() {
  const { user, logout } = useAuth()
  const { products, loading } = useProducts({ isSold: false })
  const { stores } = useStores()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [storeFilter, setStoreFilter] = useState('')

  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Promoções', href: '/gestor/promocoes', icon: 'Tag' },
    { label: 'Relatórios', href: '/gestor/relatorios', icon: 'TrendingUp' },
  ]

  const getStoreName = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId)
    return store?.name || 'N/A'
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)

      const statusMatch = statusFilter === '' || 
        getExpirationCategory(product.expiration_date) === statusFilter

      const storeMatch = storeFilter === '' || product.store_id === storeFilter

      return searchMatch && statusMatch && storeMatch
    })
  }, [products, searchTerm, statusFilter, storeFilter])

  const handleViewDetails = (productId: string) => {
    alert('Funcionalidade de visualização será implementada em breve')
  }

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'declarar', label: 'Declarar Baixa' },
    { value: 'emergencia', label: 'Emergência' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'pouco-urgente', label: 'Pouco Urgente' },
    { value: 'analise', label: 'Em Análise' },
  ]

  const storeOptions = [
    { value: '', label: 'Todas as lojas' },
    ...stores.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]

  const columns = [
    { key: 'name', label: 'Produto' },
    { key: 'barcode', label: 'Código de Barras' },
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
      key: 'store_id', 
      label: 'Loja',
      render: (value: string) => getStoreName(value)
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
        <Button variant="primary" onClick={() => handleViewDetails(value)}>
          <Eye size={16} />
        </Button>
      )
    },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando produtos..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar 
          menuItems={menuItems} 
          userName={user?.fullName || 'Gestor'} 
          userRole="Gestor" 
          onLogout={logout} 
        />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>Produtos</h1>
                  <p className={styles.subtitle}>Visualize todos os produtos cadastrados</p>
                </div>
              </div>

              <div className={styles.filters}>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por nome, marca, código..."
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
                    {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <Card padding="medium">
                <Table columns={columns} data={filteredProducts} emptyMessage="Nenhum produto encontrado" />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}