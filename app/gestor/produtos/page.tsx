'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import { mockProducts } from '@/mocks/products';
import { mockStores } from '@/mocks/stores';
import { getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function GestorProdutosPage() {
  const router = useRouter();
  const [userName] = useState('Carlos Silva');

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
      label: 'Status',
      render: (value: string) => {
        const category = getExpirationCategory(value);
        const label = getExpirationLabel(category);
        const variant = getExpirationBadgeVariant(category);
        return <Badge variant={variant}>{label}</Badge>;
      }
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
                <h1 className={styles.title}>Produtos</h1>
                <p className={styles.subtitle}>Visualize todos os produtos cadastrados</p>
              </div>

              <Card padding="medium">
                <Table columns={columns} data={allProducts} />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}