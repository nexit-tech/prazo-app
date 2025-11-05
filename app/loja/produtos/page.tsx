'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ShoppingCart, Edit2, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import SearchBar from '@/components/SearchBar/SearchBar'
import Select from '@/components/Select/Select'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { formatDaysRemaining, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers'
import styles from './page.module.css'

type SortOrder = 'asc' | 'desc' | null
type ModalType = 'sell' | 'delete' | null

export default function LojaProdutosPage() {
  const { user } = useAuth()
  const { products, loading, deleteProduct, markAsSold } = useProducts({ 
    storeId: user?.storeId || undefined,
    isSold: false 
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortOrder === 'asc') setSortOrder('desc')
      else if (sortOrder === 'desc') {
        setSortColumn(null)
        setSortOrder(null)
      }
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown size={14} />
    if (sortOrder === 'asc') return <ArrowUp size={14} />
    return <ArrowDown size={14} />
  }

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

      return searchMatch && statusMatch && categoryMatch
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
        } else if (sortColumn === 'current_price') {
          aValue = a.current_price
          bValue = b.current_price
        } else if (sortColumn === 'quantity') {
          aValue = a.quantity
          bValue = b.quantity
        } else if (sortColumn === 'expiration_date') {
          aValue = new Date(a.expiration_date).getTime()
          bValue = new Date(b.expiration_date).getTime()
        }
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [products, searchTerm, statusFilter, categoryFilter, sortColumn, sortOrder])

  const handleEdit = (productId: string) => {
    alert('Funcionalidade de edição será implementada em breve')
  }

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
      alert(`Erro ao ${modalState.type === 'delete' ? 'excluir' : 'vender'} produto`)
    } finally {
      setIsSubmitting(false)
      handleModalClose()
    }
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
    { value: 'Medicamentos', label: 'Medicamentos' },
    { value: 'Higiene e Beleza', label: 'Higiene e Beleza' },
    { value: 'Suplementos', label: 'Suplementos' },
    { value: 'Higiene', label: 'Higiene' },
    { value: 'Equipamentos', label: 'Equipamentos' },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando produtos..." />
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
                  <h1 className={styles.title}>Meus Produtos</h1>
                  <p className={styles.subtitle}>Gerencie o estoque da sua loja</p>
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
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={categoryOptions}
                    placeholder="Filtrar por categoria"
                  />
                  <div className={styles.resultCount}>
                    {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProducts.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <Card padding="medium">
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>
                          <button 
                            className={`${styles.sortButton} ${sortColumn === 'name' ? styles.active : ''}`}
                            onClick={() => handleSort('name')}
                          >
                            Produto {getSortIcon('name')}
                          </button>
                        </th>
                        <th>Código de Barras</th>
                        <th>Código Interno</th>
                        <th>
                          <button 
                            className={`${styles.sortButton} ${sortColumn === 'brand' ? styles.active : ''}`}
                            onClick={() => handleSort('brand')}
                          >
                            Marca {getSortIcon('brand')}
                          </button>
                        </th>
                        <th>
                          <button 
                            className={`${styles.sortButton} ${sortColumn === 'quantity' ? styles.active : ''}`}
                            onClick={() => handleSort('quantity')}
                          >
                            Qtd {getSortIcon('quantity')}
                          </button>
                        </th>
                        <th>
                          <button 
                            className={`${styles.sortButton} ${sortColumn === 'current_price' ? styles.active : ''}`}
                            onClick={() => handleSort('current_price')}
                          >
                            Preço Atual {getSortIcon('current_price')}
                          </button>
                        </th>
                        <th>
                          <button 
                            className={`${styles.sortButton} ${sortColumn === 'expiration_date' ? styles.active : ''}`}
                            onClick={() => handleSort('expiration_date')}
                          >
                            Validade {getSortIcon('expiration_date')}
                          </button>
                        </th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedProducts.length > 0 ? (
                        filteredAndSortedProducts.map((product) => {
                          const category = getExpirationCategory(product.expiration_date)
                          const statusLabel = getExpirationLabel(category)
                          const variant = getExpirationBadgeVariant(category)
                          
                          return (
                            <tr key={product.id}>
                              <td>{product.name}</td>
                              <td>{product.barcode}</td>
                              <td>{product.internal_code}</td>
                              <td>{product.brand}</td>
                              <td>{product.quantity}</td>
                              <td>
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(product.current_price)}
                              </td>
                              <td>{formatDaysRemaining(product.expiration_date)}</td>
                              <td>
                                <Badge variant={variant}>{statusLabel}</Badge>
                              </td>
                              <td>
                                <div className={styles.actions}>
                                  <Button variant="primary" onClick={() => setModalState({ type: 'sell', productId: product.id })}>
                                    <ShoppingCart size={16} />
                                  </Button>
                                  <Button variant="secondary" onClick={() => handleEdit(product.id)}>
                                    <Edit2 size={16} />
                                  </Button>
                                  <Button variant="danger" onClick={() => setModalState({ type: 'delete', productId: product.id })}>
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className={styles.emptyMessage}>
                            Nenhum produto encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={modalState.type !== null}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={modalState.type === 'sell' ? 'Confirmar Venda' : 'Excluir Produto'}
        message={
          modalState.type === 'sell' 
            ? 'Confirmar venda deste produto?' 
            : 'Tem certeza que deseja excluir este produto?'
        }
        confirmText={modalState.type === 'sell' ? 'Confirmar' : 'Excluir'}
        variant={modalState.type === 'sell' ? 'primary' : 'danger'}
        loading={isSubmitting}
      />
    </div>
  )
}