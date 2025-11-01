'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/SearchBar/SearchBar';
import Select from '@/components/Select/Select';
import { mockProducts } from '@/mocks/products';
import { mockStores } from '@/mocks/stores';
import { formatDaysRemaining, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function GestorProdutosPage() {
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

  const getStoreName = (storeId: string) => {
    const store = mockStores.find((s) => s.id === storeId);
    return store?.name || 'N/A';
  };

  const allProducts = mockProducts.filter((p) => !p.isSold);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const searchMatch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm);

      const statusMatch = statusFilter === '' || 
        getExpirationCategory(product.expirationDate) === statusFilter;

      const storeMatch = storeFilter === '' || product.storeId === storeFilter;

      return searchMatch && statusMatch && storeMatch;
    });
  }, [allProducts, searchTerm, statusFilter, storeFilter]);

  const handleViewDetails = (productId: string) => {
    alert(`Ver detalhes do produto ${productId}`);
  };

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'declarar', label: 'Declarar Baixa' },
    { value: 'emergencia', label: 'Emergência' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'pouco-urgente', label: 'Pouco Urgente' },
    { value: 'analise', label: 'Em Análise' },
  ];

  const storeOptions = [
    { value: '', label: 'Todas as lojas' },
    ...mockStores.map((store) => ({
      value: store.id,
      label: store.name,
    })),
  ];

  const columns = [
    { key: 'name', label: 'Produto' },
    { key: 'barcode', label: 'Código de Barras' },
    { key: 'brand', label: 'Marca' },
    { key: 'quantity', label: 'Quantidade' },
    { 
      key: 'currentPrice', 
      label: 'Preço',
      render: (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },
    { 
      key: 'storeId', 
      label: 'Loja',
      render: (value: string) => getStoreName(value)
    },
    { 
      key: 'expirationDate', 
      label: 'Validade',
      render: (value: string) => formatDaysRemaining(value)
    },
    { 
      key: 'expirationDate', 
      label: 'Status',
      render: (value: string) => {
        const category = getExpirationCategory(value);
        const label = getExpirationLabel(category);
        const variant = getExpirationBadgeVariant(category);
        return <Badge variant={variant}>{label}</Badge>;
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
  );
}