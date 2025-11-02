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
import CreateStoreModal from './components/CreateStoreModal/CreateStoreModal'
import { useAuth } from '@/hooks/useAuth'
import { useStores } from '@/hooks/useStores'
import { formatDate } from '@/utils/dateHelpers'
import styles from './page.module.css'

export default function GestorLojasPage() {
  const { user, logout } = useAuth()
  const { stores, loading, toggleActive, refresh } = useStores()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleEdit = (storeId: string) => {
    alert(`Funcionalidade de edição será implementada em breve`)
  }

  const handleToggleStatus = async (storeId: string, currentStatus: boolean) => {
    if (confirm(`Deseja realmente ${currentStatus ? 'desativar' : 'ativar'} esta loja?`)) {
      try {
        await toggleActive(storeId, !currentStatus)
      } catch (error) {
        alert('Erro ao alterar status da loja')
      }
    }
  }

  const handleViewDetails = (storeId: string) => {
    alert(`Funcionalidade de visualização será implementada em breve`)
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
            onClick={() => handleToggleStatus(value, row.is_active)}
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
                <div className={styles.headerText}>
                  <h1 className={styles.title}>Lojas</h1>
                  <p className={styles.subtitle}>Gerencie todas as filiais</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} />
                  Nova Loja
                </Button>
              </div>

              <div className={styles.statsGrid}>
                <Card padding="medium">
                  <div>
                    <p className={styles.resultCount}>Total de Lojas</p>
                    <h3 className={styles.title}>{stores.length}</h3>
                  </div>
                </Card>

                <Card padding="medium">
                  <div>
                    <p className={styles.resultCount}>Lojas Ativas</p>
                    <h3 className={styles.title}>{activeStores}</h3>
                  </div>
                </Card>

                <Card padding="medium">
                  <div>
                    <p className={styles.resultCount}>Lojas Inativas</p>
                    <h3 className={styles.title}>{inactiveStores}</h3>
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
          </div>
        </main>
      </div>

      <CreateStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}