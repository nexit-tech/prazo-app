'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Tag, Download, Eye, Printer } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { mockPromotions } from '@/mocks/promotions';
import { mockProducts } from '@/mocks/products';
import styles from './page.module.css';

export default function LojaEtiquetasPage() {
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

  const storePromotions = mockPromotions.filter((p) => p.storeId === storeId && p.isVisible);

  const getProductName = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    return product?.name || 'N/A';
  };

  const handleDownload = (promotionId: string) => {
    alert(`Baixando etiqueta ${promotionId}...`);
  };

  const handlePrint = (promotionId: string) => {
    alert(`Imprimindo etiqueta ${promotionId}...`);
  };

  const totalLabels = storePromotions.length;
  const activeLabels = storePromotions.filter((p) => p.isActive).length;
  const averageDiscount = storePromotions.length > 0
    ? Math.round(storePromotions.reduce((sum, p) => sum + p.discount, 0) / storePromotions.length)
    : 0;

  const columns = [
    { 
      key: 'productId', 
      label: 'Produto',
      render: (value: string) => getProductName(value)
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
      render: (value: string) => (
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => handleDownload(value)}>
            <Download size={16} />
            Baixar
          </Button>
          <Button variant="secondary" onClick={() => handlePrint(value)}>
            <Printer size={16} />
            Imprimir
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
                <h1 className={styles.title}>Etiquetas</h1>
                <p className={styles.subtitle}>Baixe e imprima etiquetas de promoção</p>
              </div>

              <div className={styles.grid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Tag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Total de Etiquetas</p>
                    <h2 className={styles.statValue}>{totalLabels}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Eye size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Etiquetas Ativas</p>
                    <h2 className={styles.statValue}>{activeLabels}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Download size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Desconto Médio</p>
                    <h2 className={styles.statValue}>{averageDiscount}%</h2>
                  </div>
                </div>
              </div>

              <Card padding="medium">
                <Table 
                  columns={columns} 
                  data={storePromotions} 
                  emptyMessage="Nenhuma etiqueta disponível" 
                />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}