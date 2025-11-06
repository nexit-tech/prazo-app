'use client'

import { useState, useMemo } from 'react'
import { Plus, Eye, Edit2, Power } from 'lucide-react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Card from '@/components/Card/Card'
import Table from '@/components/Table/Table'
import Badge from '@/components/Badge/Badge'
import Button from '@/components/Button/Button'
import SearchBar from '@/components/SearchBar/SearchBar'
import Select from '@/components/Select/Select'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import CreateStoreModal from './components/CreateStoreModal/CreateStoreModal'
import ViewStoreModal from './components/ViewStoreModal/ViewStoreModal'
import EditStoreModal from './components/EditStoreModal/EditStoreModal'
import DeleteStoreModal from './components/DeleteStoreModal/DeleteStoreModal'
import { useStores } from '@/hooks/useStores'
import { formatDate } from '@/utils/dateHelpers'
import styles from './page.module.css'

type ModalType = 'toggleStatus' | null

export default function GestorLojasPage() {
  const { stores, loading, toggleActive, refresh } = useStores()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [selectedStore, setSelectedStore] = useState<{ id: string; name: string; code: string; isActive: boolean } | null>(null)
  
  const [modalState, setModalState] = useState<{ type: ModalType; storeId: string | null; currentStatus: boolean }>({
    type: null,
    storeId: null,
    currentStatus: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Promoções', href: '/gestor/promocoes', icon: 'Tag' },
    { label: 'Relatórios', href: '/gestor/relatorios', icon: 'TrendingUp' },
  ]

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const searchMatch = searchTerm === '' || 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.phone.includes(searchTerm) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase())

      const statusMatch = statusFilter === '' || 
        (statusFilter === 'active' && store.is_active) ||
        (statusFilter === 'inactive' && !store.is_active)

      return searchMatch && statusMatch
    })
  }, [stores, searchTerm, statusFilter])

  const handleViewDetails = (storeId: string) => {
    setSelectedStore({ id: storeId, name: '', code: '', isActive: false }) 
    setIsViewModalOpen(true)
  }

  const handleEdit = (storeId: string) => {
    setSelectedStore({ id: storeId, name: '', code: '', isActive: false })
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (store: { id: string; name: string; code: string }) => {
    setSelectedStore({ ...store, isActive: false }) 
    setIsDeleteModalOpen(true)
  }

  const handleOpenToggleModal = (storeId: string, currentStatus: boolean) => {
    setModalState({ type: 'toggleStatus', storeId, currentStatus })
  }

  const handleModalClose = () => {
    setModalState({ type: null, storeId: null, currentStatus: false })
  }

  const handleModalConfirm = async () => {
    if (!modalState.storeId || modalState.type !== 'toggleStatus') return

    setIsSubmitting(true)
    try {
      await toggleActive(modalState.storeId, !modalState.currentStatus)
    } catch (error) {
      alert('Erro ao alterar status da loja')
    } finally {
      setIsSubmitting(false)
      handleModalClose()
    }
  }

  const handleSuccess = () => {
    refresh()
  }

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
  ]

  const activeStores = stores.filter((s) => s.is_active).length
  const inactiveStores = stores.filter((s) => !s.is_active).length

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefone' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Ativa' : 'Inativa'}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Cadastro',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'id',
      label: 'Ações',
      render: (value: string, row: any) => (
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => handleViewDetails(value)}>
            <Eye size={16} />
          </Button>
          <Button variant="secondary" onClick={() => handleEdit(value)}>
            <Edit2 size={16} />
          </Button>
          <Button 
            variant={row.is_active ? 'danger' : 'primary'} 
            onClick={() => handleOpenToggleModal(value, row.is_active)}
          >
            <Power size={16} />
          </Button>
        </div>
      )
    },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando lojas..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.headerText}>
                <h1 className={styles.title}>Lojas</h1>
                <p className={styles.subtitle}>Gerencie todas as filiais</p>
              </div>
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={18} />
                Nova Loja
              </Button>
            </div>

            <div className={styles.statsGrid}>
              <Card padding="medium">
                <div>
                  <p className={styles.statLabel}>Total de Lojas</p>
                  <h3 className={styles.statValue}>{stores.length}</h3>
                </div>
              </Card>

              <Card padding="medium">
                <div>
                  <p className={styles.statLabel}>Lojas Ativas</p>
                  <h3 className={styles.statValue}>{activeStores}</h3>
                </div>
              </Card>

              <Card padding="medium">
                <div>
                  <p className={styles.statLabel}>Lojas Inativas</p>
                  <h3 className={styles.statValue}>{inactiveStores}</h3>
                </div>
              </Card>
            </div>

            <div className={styles.filters}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nome, código, email..."
                fullWidth
              />
              <div className={styles.filterRow}>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                  placeholder="Filtrar por status"
                />
                <div className={styles.resultCount}>
                  {filteredStores.length} loja{filteredStores.length !== 1 ? 's' : ''} encontrada{filteredStores.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <Card padding="medium">
              <Table columns={columns} data={filteredStores} emptyMessage="Nenhuma loja encontrada" />
            </Card>
          </div>
        </main>
      </div>

      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {selectedStore?.id && (
        <>
          <ViewStoreModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false)
              setSelectedStore(null)
            }}
            storeId={selectedStore.id}
          />

          <EditStoreModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedStore(null)
            }}
            storeId={selectedStore.id}
            onSuccess={handleSuccess}
          />
        </>
      )}

      <DeleteStoreModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedStore(null)
        }}
        store={selectedStore ? { id: selectedStore.id, name: selectedStore.name, code: selectedStore.code } : null}
        onSuccess={handleSuccess}
      />

      <ConfirmModal
        isOpen={modalState.type === 'toggleStatus'}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={modalState.currentStatus ? 'Desativar Loja' : 'Ativar Loja'}
        message={`Deseja realmente ${modalState.currentStatus ? 'desativar' : 'ativar'} esta loja?`}
        confirmText={modalState.currentStatus ? 'Desativar' : 'Ativar'}
        variant={modalState.currentStatus ? 'danger' : 'primary'}
        loading={isSubmitting}
      />
    </div>
  )
}