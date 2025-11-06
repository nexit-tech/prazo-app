'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { mockTransfers } from '@/mocks/transfers';
import { mockProducts } from '@/mocks/products';
import { mockStores } from '@/mocks/stores';
import { formatDate } from '@/utils/dateHelpers';
import styles from './page.module.css';

type TransferStatus = 'pending' | 'approved' | 'rejected';

export default function GestorTransferenciasPage() {
  const menuItems = [
    { label: 'Dashboard', href: '/gestor/dashboard', icon: 'BarChart3' },
    { label: 'Lojas', href: '/gestor/lojas', icon: 'Store' },
    { label: 'Produtos', href: '/gestor/produtos', icon: 'Package' },
    { label: 'Transferências', href: '/gestor/transferencias', icon: 'ArrowLeftRight' },
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

  const handleApprove = (transferId: string) => {
    alert(`Transferência ${transferId} aprovada!`);
  };

  const handleReject = (transferId: string) => {
    alert(`Transferência ${transferId} rejeitada!`);
  };

  const columns = [
    { 
      key: 'productId', 
      label: 'Produto',
      render: (value: string) => getProductName(value)
    },
    { 
      key: 'fromStoreId', 
      label: 'De',
      render: (value: string) => getStoreName(value)
    },
    { 
      key: 'toStoreId', 
      label: 'Para',
      render: (value: string) => getStoreName(value)
    },
    { key: 'quantity', label: 'Quantidade' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => {
        const status = value as TransferStatus;
        const variantMap: Record<TransferStatus, 'warning' | 'success' | 'danger'> = {
          pending: 'warning',
          approved: 'success',
          rejected: 'danger',
        };
        const labelMap: Record<TransferStatus, string> = {
          pending: 'Pendente',
          approved: 'Aprovado',
          rejected: 'Rejeitado',
        };
        return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
      }
    },
    { 
      key: 'requestedAt', 
      label: 'Data',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'id',
      label: 'Ações',
      render: (value: string, row: any) => {
        if (row.status !== 'pending') return null;
        return (
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => handleApprove(value)}>
              Aprovar
            </Button>
            <Button variant="danger" onClick={() => handleReject(value)}>
              Rejeitar
            </Button>
          </div>
        );
      }
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar menuItems={menuItems} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Transferências</h1>
              <p className={styles.subtitle}>Aprove ou rejeite transferências entre lojas</p>
            </div>

            <Card padding="medium">
              <Table columns={columns} data={mockTransfers} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}