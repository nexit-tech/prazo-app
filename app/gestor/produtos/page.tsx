'use client'

import { useState, useMemo } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ProductFilters from './components/ProductFilters/ProductFilters'
import ProductTable from './components/ProductTable/ProductTable'
import { useProducts } from '@/hooks/useProducts'
import { useStores } from '@/hooks/useStores'
import { getDaysUntilExpiration, getExpirationCategory } from '@/utils/dateHelpers'
import styles from './page.module.css'

type SortOrder = 'asc' | 'desc' | null

export default function GestorProdutosPage() {
  const { products, loading } = useProducts({ isSold: false })
  const { stores } = useStores()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [storeFilter, setStoreFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minDays, setMinDays] = useState('')
  const [maxDays, setMaxDays] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

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

  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category))
    return Array.from(categories).sort()
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchMatch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm) ||
        product.internal_code.toLowerCase().includes(searchTerm.toLowerCase())

      const statusMatch = statusFilter === '' || 
        getExpirationCategory(product.expiration_date) === statusFilter

      const categoryMatch = categoryFilter === '' || 
        product.category === categoryFilter

      const storeMatch = storeFilter === '' || 
        product.store_id === storeFilter

      const priceMatch = 
        (minPrice === '' || product.current_price >= parseFloat(minPrice)) &&
        (maxPrice === '' || product.current_price <= parseFloat(maxPrice))

      const daysUntilExpiration = getDaysUntilExpiration(product.expiration_date)
      const daysMatch =
        (minDays === '' || daysUntilExpiration >= parseInt(minDays)) &&
        (maxDays === '' || daysUntilExpiration <= parseInt(maxDays))

      return searchMatch && statusMatch && categoryMatch && storeMatch && priceMatch && daysMatch
    })

    if (sortColumn && sortOrder) {
      result.sort((a, b) => {
        let aValue: string | number = ''
        let bValue: string | number = ''

        if (sortColumn === 'name') {
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
        } else if (sortColumn === 'brand') {
          aValue = a.brand.toLowerCase()
          bValue = b.brand.toLowerCase()
        } else if (sortColumn === 'category') {
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
        } else if (sortColumn === 'current_price') {
          aValue = a.current_price
          bValue = b.current_price
        } else if (sortColumn === 'quantity') {
          aValue = a.quantity
          bValue = b.quantity
        } else if (sortColumn === 'expiration_date') {
          aValue = new Date(a.expiration_date).getTime()
          bValue = new Date(b.expiration_date).getTime()
        } else if (sortColumn === 'store_id') {
          aValue = getStoreName(a.store_id).toLowerCase()
          bValue = getStoreName(b.store_id).toLowerCase()
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [products, searchTerm, statusFilter, categoryFilter, storeFilter, minPrice, maxPrice, minDays, maxDays, sortColumn, sortOrder, stores])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortColumn(null)
        setSortOrder(null)
      }
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const handleClearFilters = () => {
    setStatusFilter('')
    setCategoryFilter('')
    setStoreFilter('')
    setMinPrice('')
    setMaxPrice('')
    setMinDays('')
    setMaxDays('')
  }

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

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
  ]

  const storeOptions = [
    { value: '', label: 'Todas as lojas' },
    ...stores.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ]

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando produtos..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Produtos</h1>
              <p className={styles.subtitle}>Visualize todos os produtos cadastrados</p>
            </div>

            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              storeFilter={storeFilter}
              onStoreChange={setStoreFilter}
              minPrice={minPrice}
              onMinPriceChange={setMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              minDays={minDays}
              onMinDaysChange={setMinDays}
              maxDays={maxDays}
              onMaxDaysChange={setMaxDays}
              onClearFilters={handleClearFilters}
              statusOptions={statusOptions}
              categoryOptions={categoryOptions}
              storeOptions={storeOptions}
              resultsCount={filteredAndSortedProducts.length}
            />

            <Card padding="medium">
              <ProductTable
                products={filteredAndSortedProducts}
                getStoreName={getStoreName}
                onViewDetails={handleViewDetails}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}