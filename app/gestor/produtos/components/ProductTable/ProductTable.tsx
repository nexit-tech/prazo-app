import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import { formatDaysRemaining, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers'
import styles from './ProductTable.module.css'

type SortOrder = 'asc' | 'desc' | null

interface ProductTableProps {
  products: any[]
  getStoreName: (storeId: string) => string
  onViewDetails: (productId: string) => void
  sortColumn: string | null
  sortOrder: SortOrder
  onSort: (column: string) => void
}

export default function ProductTable({
  products,
  getStoreName,
  onViewDetails,
  sortColumn,
  sortOrder,
  onSort,
}: ProductTableProps) {
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown size={14} />
    if (sortOrder === 'asc') return <ArrowUp size={14} />
    return <ArrowDown size={14} />
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'name' ? styles.active : ''}`}
                onClick={() => onSort('name')}
              >
                Produto {getSortIcon('name')}
              </button>
            </th>
            <th>Código de Barras</th>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'brand' ? styles.active : ''}`}
                onClick={() => onSort('brand')}
              >
                Marca {getSortIcon('brand')}
              </button>
            </th>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'category' ? styles.active : ''}`}
                onClick={() => onSort('category')}
              >
                Categoria {getSortIcon('category')}
              </button>
            </th>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'quantity' ? styles.active : ''}`}
                onClick={() => onSort('quantity')}
              >
                Qtd {getSortIcon('quantity')}
              </button>
            </th>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'current_price' ? styles.active : ''}`}
                onClick={() => onSort('current_price')}
              >
                Preço {getSortIcon('current_price')}
              </button>
            </th>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'store_id' ? styles.active : ''}`}
                onClick={() => onSort('store_id')}
              >
                Loja {getSortIcon('store_id')}
              </button>
            </th>
            <th>
              <button 
                className={`${styles.sortButton} ${sortColumn === 'expiration_date' ? styles.active : ''}`}
                onClick={() => onSort('expiration_date')}
              >
                Validade {getSortIcon('expiration_date')}
              </button>
            </th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              const category = getExpirationCategory(product.expiration_date)
              const statusLabel = getExpirationLabel(category)
              const variant = getExpirationBadgeVariant(category)
              
              return (
                <tr key={product.id}>
                  <td className={styles.productName}>{product.name}</td>
                  <td>{product.barcode}</td>
                  <td>{product.brand}</td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {product.category}
                    </span>
                  </td>
                  <td className={styles.centered}>{product.quantity}</td>
                  <td className={styles.price}>{formatCurrency(product.current_price)}</td>
                  <td>{getStoreName(product.store_id)}</td>
                  <td className={styles.expiration}>{formatDaysRemaining(product.expiration_date)}</td>
                  <td>
                    <Badge variant={variant}>{statusLabel}</Badge>
                  </td>
                  <td>
                    <Button variant="primary" onClick={() => onViewDetails(product.id)}>
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={10} className={styles.emptyMessage}>
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}