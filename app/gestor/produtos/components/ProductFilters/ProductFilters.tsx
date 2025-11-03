import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import SearchBar from '@/components/SearchBar/SearchBar'
import Select from '@/components/Select/Select'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import styles from './ProductFilters.module.css'

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  storeFilter: string
  onStoreChange: (value: string) => void
  minPrice: string
  onMinPriceChange: (value: string) => void
  maxPrice: string
  onMaxPriceChange: (value: string) => void
  minDays: string
  onMinDaysChange: (value: string) => void
  maxDays: string
  onMaxDaysChange: (value: string) => void
  onClearFilters: () => void
  statusOptions: Array<{ value: string; label: string }>
  categoryOptions: Array<{ value: string; label: string }>
  storeOptions: Array<{ value: string; label: string }>
  resultsCount: number
}

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  storeFilter,
  onStoreChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  minDays,
  onMinDaysChange,
  maxDays,
  onMaxDaysChange,
  onClearFilters,
  statusOptions,
  categoryOptions,
  storeOptions,
  resultsCount,
}: ProductFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasActiveFilters = Boolean(
    statusFilter ||
    categoryFilter ||
    storeFilter ||
    minPrice ||
    maxPrice ||
    minDays ||
    maxDays
  )

  return (
    <div className={styles.container}>
      <div className={styles.mainFilters}>
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar por nome, marca, código..."
          fullWidth
        />
        <Button 
          variant={showAdvanced ? 'primary' : 'secondary'}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter size={18} />
          Filtros Avançados
        </Button>
      </div>

      {showAdvanced && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterGroup}>
            <h4 className={styles.filterGroupTitle}>Filtros Rápidos</h4>
            <div className={styles.filterRow}>
              <Select
                value={statusFilter}
                onChange={onStatusChange}
                options={statusOptions}
                placeholder="Status de validade"
                fullWidth
              />
              <Select
                value={categoryFilter}
                onChange={onCategoryChange}
                options={categoryOptions}
                placeholder="Categoria"
                fullWidth
              />
              <Select
                value={storeFilter}
                onChange={onStoreChange}
                options={storeOptions}
                placeholder="Loja"
                fullWidth
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterGroupTitle}>Faixa de Preço</h4>
            <div className={styles.rangeRow}>
              <Input
                type="number"
                label="Preço Mínimo"
                placeholder="R$ 0,00"
                value={minPrice}
                onChange={onMinPriceChange}
                fullWidth
              />
              <span className={styles.rangeSeparator}>até</span>
              <Input
                type="number"
                label="Preço Máximo"
                placeholder="R$ 999,99"
                value={maxPrice}
                onChange={onMaxPriceChange}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterGroupTitle}>Dias até Vencimento</h4>
            <div className={styles.rangeRow}>
              <Input
                type="number"
                label="Mínimo"
                placeholder="0 dias"
                value={minDays}
                onChange={onMinDaysChange}
                fullWidth
              />
              <span className={styles.rangeSeparator}>até</span>
              <Input
                type="number"
                label="Máximo"
                placeholder="365 dias"
                value={maxDays}
                onChange={onMaxDaysChange}
                fullWidth
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className={styles.clearFilters}>
              <Button variant="outline" onClick={onClearFilters}>
                <X size={18} />
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      )}

      <div className={styles.resultCount}>
        {resultsCount} produto{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
      </div>
    </div>
  )
}