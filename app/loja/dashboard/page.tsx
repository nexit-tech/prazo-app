'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Package, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { mockProducts } from '@/mocks/products';
import { getExpirationCategory } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function LojaDashboard() {
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
  const soldProducts = mockProducts.filter((p) => p.storeId === storeId && p.isSold);
  
  const totalProducts = storeProducts.length;
  const totalSold = soldProducts.length;
  const totalValue = storeProducts.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
  const totalRevenue = soldProducts.reduce((sum, p) => sum + p.currentPrice, 0);
  
  const declarar = storeProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'declarar').length;
  const emergencia = storeProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'emergencia').length;
  const urgente = storeProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'urgente').length;
  const poucoUrgente = storeProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'pouco-urgente').length;
  const analise = storeProducts.filter((p) => getExpirationCategory(p.expirationDate) === 'analise').length;

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
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Filial Centro - FL001</p>
              </div>

              <div className={styles.grid}>
                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <Package size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Produtos em Estoque</p>
                    <h2 className={styles.statValue}>{totalProducts}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <TrendingUp size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Produtos Vendidos</p>
                    <h2 className={styles.statValue}>{totalSold}</h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <DollarSign size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Valor em Estoque</p>
                    <h2 className={styles.statValue}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalValue)}
                    </h2>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIconWrapper}>
                    <TrendingDown size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Receita Total</p>
                    <h2 className={styles.statValue}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalRevenue)}
                    </h2>
                  </div>
                </div>
              </div>

              <div className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>Análise por Validade</h3>
                <div className={styles.categoryGrid}>
                  <div className={`${styles.categoryCard} ${styles.declarar}`}>
                    <div className={styles.categoryIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Declarar Baixa</p>
                      <h3 className={styles.categoryValue}>{declarar}</h3>
                      <span className={styles.categoryDescription}>1-15 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.emergencia}`}>
                    <div className={styles.categoryIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Emergência</p>
                      <h3 className={styles.categoryValue}>{emergencia}</h3>
                      <span className={styles.categoryDescription}>16-29 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.urgente}`}>
                    <div className={styles.categoryIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Urgente</p>
                      <h3 className={styles.categoryValue}>{urgente}</h3>
                      <span className={styles.categoryDescription}>30-59 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.poucoUrgente}`}>
                    <div className={styles.categoryIcon}>
                      <Package size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Pouco Urgente</p>
                      <h3 className={styles.categoryValue}>{poucoUrgente}</h3>
                      <span className={styles.categoryDescription}>60-89 dias</span>
                    </div>
                  </div>

                  <div className={`${styles.categoryCard} ${styles.analise}`}>
                    <div className={styles.categoryIcon}>
                      <Package size={24} />
                    </div>
                    <div className={styles.categoryContent}>
                      <p className={styles.categoryLabel}>Em Análise</p>
                      <h3 className={styles.categoryValue}>{analise}</h3>
                      <span className={styles.categoryDescription}>90+ dias</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}