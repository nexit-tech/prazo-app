'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/SearchBar/SearchBar';
import Select from '@/components/Select/Select';
import { mockStores } from '@/mocks/stores';
import { formatDate } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function GestorLojasPage() {
  const router = useRouter();
  const [userName] = useState('Carlos Silva');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleLogout = () => {
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Promoções', href: '/gestor/promocoes', icon: 'Tag' },
    { label: 'Relatórios', href: '/gestor/relatorios', icon: 'TrendingUp' },
  ];

  // Filtros
  const filteredStores = useMemo(() => {
    return mockStores.filter((store) => {
      // Busca vetorial (nome, código, endereço, telefone, email)
      const searchMatch = searchTerm === '' || 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.phone.includes(searchTerm) ||
        (store.email && store.email.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de status
      const statusMatch = statusFilter === '' || 
        (statusFilter === 'active' && store.isActive) ||
        (statusFilter === 'inactive' && !store.isActive);

      return searchMatch && statusMatch;
    });
  }, [searchTerm, statusFilter]);

  const handleEdit = (storeId: string) => {
    alert(`Editar loja ${storeId}`);
  };

  const handleToggleStatus = (storeId: string) => {
    alert(`Alternar status da loja ${storeId}`);
  };

  const handleViewDetails = (storeId: string) => {
    alert(`Ver detalhes da loja ${storeId}`);
  };

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
  ];

  const activeStores = mockStores.filter((s) => s.isActive).length;
  const inactiveStores = mockStores.filter((s) => !s.isActive).length;

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Endereço' },
    { key: 'phone', label: 'Telefone' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Ativa' : 'Inativa'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Cadastro',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'id',
      label: 'Ações',
      render: (value: string, row: any) => (
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => handleViewDetails(value)}>
            Detalhes
          </Button>
          <Button variant="secondary" onClick={() => handleEdit(value)}>
            Editar
          </Button>
          <Button 
            variant={row.isActive ? 'danger' : 'primary'} 
            onClick={() => handleToggleStatus(value)}
          >
            {row.isActive ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar 
          menuItems={menuItems} 
          userName={userName} 
          userRole="Gestor" 
          onLogout={handleLogout} 
        />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>Lojas</h1>
                  <p className={styles.subtitle}>Gerencie todas as filiais</p>
                </div>
                <Button variant="primary" onClick={() => router.push('/gestor/lojas/cadastrar')}>
                  <Plus size={18} />
                  Nova Loja
                </Button>
              </div>

              <div className={styles.statsGrid}>
                <Card padding="medium">
                  <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                      <p className={styles.statLabel}>Total de Lojas</p>
                      <h3 className={styles.statValue}>{mockStores.length}</h3>
                    </div>
                  </div>
                </Card>

                <Card padding="medium">
                  <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                      <p className={styles.statLabel}>Lojas Ativas</p>
                      <h3 className={styles.statValue}>{activeStores}</h3>
                    </div>
                  </div>
                </Card>

                <Card padding="medium">
                  <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                      <p className={styles.statLabel}>Lojas Inativas</p>
                      <h3 className={styles.statValue}>{inactiveStores}</h3>
                    </div>
                  </div>
                </Card>
              </div>

              <div className={styles.filters}>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por nome, código, email, endereço ou telefone..."
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
    </div>
  );
}