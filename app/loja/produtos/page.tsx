'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { mockProducts } from '@/mocks/products';
import { formatDate, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function LojaProdutosPage() {
  const router = useRouter();
  const [userName] = useState('Ana Costa');
  const storeId = 'store-1';

  const handleLogout = () => {
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/loja/dashboard', icon: 'BarChart3' },
    { label: 'Produtos', href: '/loja/produtos', icon: 'Package' },
    { label: 'Cadastrar Produto', href: '/loja/cadastrar', icon: 'Plus' },
    { label: 'Alertas', href: '/loja/alertas', icon: 'AlertTriangle' },
    { label: 'Etiquetas', href: '/loja/etiquetas', icon: 'Tag' },
  ];

  const storeProducts = mockProducts.filter((p) => p.storeId === storeId && !p.isSold);

  const handleEdit = (productId: string) => {
    alert(`Editar produto ${productId}`);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      alert(`Produto ${productId} excluído!`);
    }
  };

  const handleSell = (productId: string) => {
    if (confirm('Confirmar venda deste produto?')) {
      alert(`Produto ${productId} vendido!`);
    }
  };

  const columns = [
    { key: 'name', label: 'Produto' },
    { key: 'barcode', label: 'Código de Barras' },
    { key: 'internalCode', label: 'Código Interno' },
    { key: 'brand', label: 'Marca' },
    { key: 'quantity', label: 'Qtd' },
    { 
      key: 'currentPrice', 
      label: 'Preço Atual',
      render: (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    },
    { 
      key: 'expirationDate', 
      label: 'Validade',
      render: (value: string) => formatDate(value)
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
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => handleSell(value)}>
            Vender
          </Button>
          <Button variant="secondary" onClick={() => handleEdit(value)}>
            Editar
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
          userRole="Loja" 
          onLogout={handleLogout} 
        />
        
        <main className={styles.main}>
          <div className={styles.mainCard}>
            <div className={styles.content}>
              <div className={styles.header}>
                <h1 className={styles.title}>Meus Produtos</h1>
                <p className={styles.subtitle}>Gerencie o estoque da sua loja</p>
              </div>

              <Card padding="medium">
                <Table columns={columns} data={storeProducts} emptyMessage="Nenhum produto cadastrado" />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}