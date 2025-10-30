'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertTriangle, Package, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Table from '@/components/Table/Table';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { mockProducts } from '@/mocks/products';
import { formatDate, getExpirationCategory, getExpirationLabel, getExpirationBadgeVariant } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function LojaAlertasPage() {
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
  
  const criticalProducts = storeProducts.filter((p) => {
    const category = getExpirationCategory(p.expirationDate);
    return category === 'declarar' || category === 'emergencia' || category === 'urgente';
  });

  const declarar = criticalProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'declarar').length;
  const emergencia = criticalProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'emergencia').length;
  const urgente = criticalProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'urgente').length;

  const handleAction = (productId: string, action: string) => {
    alert(`${action} produto ${productId}`);
  };

  const columns = [
    { key: 'name', label: 'Produto' },
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
          <Button variant="primary" onClick={() => handleAction(value, 'Criar promoção')}>
            Promoção
          </Button>
          <Button variant="danger" onClick={() => handleAction(value, 'Declarar baixa')}>
            Baixa
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
                <h1 className={styles.title}>Alertas</h1>
                <p className={styles.subtitle}>Produtos que necessitam atenção</p>
              </div>

              <div className={styles.grid}>
                <div className={`${styles.alertCard} ${styles.declarar}`}>
                  <div className={styles.alertIcon}>
                    <AlertTriangle size={24} />
                  </div>
                  <div className={styles.alertContent}>
                    <p className={styles.alertLabel}>Declarar Baixa</p>
                    <h3 className={styles.alertValue}>{declarar}</h3>
                    <span className={styles.alertDescription}>1-15 dias</span>
                  </div>
                </div>

                <div className={`${styles.alertCard} ${styles.emergencia}`}>
                  <div className={styles.alertIcon}>
                    <AlertTriangle size={24} />
                  </div>
                  <div className={styles.alertContent}>
                    <p className={styles.alertLabel}>Emergência</p>
                    <h3 className={styles.alertValue}>{emergencia}</h3>
                    <span className={styles.alertDescription}>16-29 dias</span>
                  </div>
                </div>

                <div className={`${styles.alertCard} ${styles.urgente}`}>
                  <div className={styles.alertIcon}>
                    <AlertTriangle size={24} />
                  </div>
                  <div className={styles.alertContent}>
                    <p className={styles.alertLabel}>Urgente</p>
                    <h3 className={styles.alertValue}>{urgente}</h3>
                    <span className={styles.alertDescription}>30-59 dias</span>
                  </div>
                </div>
              </div>

              <Card padding="medium">
                <Table 
                  columns={columns} 
                  data={criticalProducts} 
                  emptyMessage="Nenhum produto em alerta" 
                />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}