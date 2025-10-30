'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import { mockStores } from '@/mocks/stores';
import { formatDate } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function GestorLojasPage() {
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

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nome' },
    { key: 'address', label: 'Endereço' },
    { key: 'phone', label: 'Telefone' },
    { 
      key: 'createdAt', 
      label: 'Cadastro',
      render: (value: string) => formatDate(value)
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
                <h1 className={styles.title}>Lojas</h1>
                <p className={styles.subtitle}>Gerencie todas as filiais</p>
              </div>

              <Card padding="medium">
                <Table columns={columns} data={mockStores} />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}