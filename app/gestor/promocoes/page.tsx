'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Tag, TrendingUp, Eye, EyeOff } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/SearchBar/SearchBar';
import Select from '@/components/Select/Select';
import { mockPromotions } from '@/mocks/promotions';
import { mockProducts } from '@/mocks/products';
import { mockStores } from '@/mocks/stores';
import styles from './page.module.css';

export default function GestorPromocoesPage() {
  const router = useRouter();
  const [userName] = useState('Carlos Silva');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');

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

  const getProductName = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    return product?.name || 'N/A';
  };

  const getStoreName = (storeId: string) => {
    const store = mockStores.find((s) => s.id === storeId);
    return store?.name || 'N/A';
  };

  // Filtros
  const filteredPromotions = useMemo(() => {
    return mockPromotions.filter((promotion) => {
      const productName = getProductName(promotion.productId);
      
      // Busca vetorial
      const searchMatch = searchTerm === '' || 
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.newBarcode.includes(searchTerm);

      // Filtro de status
      const statusMatch = statusFilter === '' || 
        (statusFilter === 'active' && promotion.isActive) ||
        (statusFilter === 'inactive' && !promotion.isActive) ||
        (statusFilter === 'visible' && promotion.isVisible) ||
        (statusFilter === 'hidden' && !promotion.isVisible);

      // Filtro de loja
      const storeMatch = storeFilter === '' || promotion.storeId === storeFilter;

      return searchMatch && statusMatch && storeMatch;
    });
  }, [mockPromotions, searchTerm, statusFilter, storeFilter]);

  const handleToggleVisibility = (promotionId: string) => {
    alert(`Alternar visibilidade da promoção ${promotionId}`);
  };

  const handleDelete = (promotionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
      alert(`Promoção ${promotionId} excluída!`);
    }
  };

  const totalPromotions = filteredPromotions.length;
  const activePromotions = filteredPromotions.filter((p) => p.isActive).length;
  const visiblePromotions = filteredPromotions.filter((p) => p.isVisible).length;
  const totalDiscount = filteredPromotions.reduce((sum, p) => sum + p.discount, 0);

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
    { value: 'visible', label: 'Visíveis' },
    { value: 'hidden', label: 'Ocultas' },
  ];

  const storeOptions = [
    { value: '', label: 'Todas as lojas' },
    ...mockStores.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ];

  const columns = [
    { 
      key: 'productId', 
      label: 'Produto',
      render: (value: string) => getProductName(value)
    },
    { 
      key: 'storeId', 
      label: 'Loja',
      render: (value: string) => getStoreName(value)
    },
    { 
      key: 'discount', 
      label: 'Desconto',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'newPrice', 
      label: 'Novo Preço',
      render: (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },
    { key: 'newBarcode', label: 'Novo Código' },
    { 
      key: 'isVisible', 
      label: 'Visibilidade',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Visível' : 'Oculto'}
        </Badge>
      )
    },
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
      key: 'id',
      label: 'Ações',
      render: (value: string, row: any) => (
        <div className={styles.actions}>
          <Button 
            variant="secondary" 
            onClick={() => handleToggleVisibility(value)}
          >
            {row.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button variant="danger" onClick={() => handleDelete(value)}>
            Excluir
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
                  <h1 className={styles.title}>Promoções</h1>
                  <p className={styles.subtitle}>Gerencie descontos e promoções</p>
                </div>
                <Button variant="primary">Nova Promoção</Button>
              </div>

              <div className={styles.grid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Tag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Total de Promoções</p>
                    <h2 className={styles.statValue}>{totalPromotions}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <TrendingUp size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Promoções Ativas</p>
                    <h2 className={styles.statValue}>{activePromotions}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Eye size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Visíveis para Lojas</p>
                    <h2 className={styles.statValue}>{visiblePromotions}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Tag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Desconto Médio</p>
                    <h2 className={styles.statValue}>
                      {totalPromotions > 0 ? Math.round(totalDiscount / totalPromotions) : 0}%
                    </h2>
                  </div>
                </div>
              </div>

              <div className={styles.filters}>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por produto, código..."
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
                    {filteredPromotions.length} promoç{filteredPromotions.length !== 1 ? 'ões' : 'ão'} encontrada{filteredPromotions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <Card padding="medium">
                <Table columns={columns} data={filteredPromotions} emptyMessage="Nenhuma promoção encontrada" />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}