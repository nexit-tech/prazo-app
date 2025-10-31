'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  Tag,
  BarChart3,
  Download
} from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Button from '@/components/Button/Button';
import DatePicker from '@/components/DatePicker/DatePicker';
import Select from '@/components/Select/Select';
import { mockProducts } from '@/mocks/products';
import { mockPromotions } from '@/mocks/promotions';
import { getExpirationCategory } from '@/utils/dateHelpers';
import styles from './page.module.css';

export default function GestorRelatoriosPage() {
  const router = useRouter();
  const [userName] = useState('Carlos Silva');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');

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

  const periodOptions = [
    { value: 'all', label: 'Todo o período' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mês' },
    { value: 'custom', label: 'Período personalizado' },
  ];

  // Função para filtrar por data
  const filterByDate = (date: string) => {
    if (periodFilter === 'all') return true;
    
    const itemDate = new Date(date);
    const today = new Date();
    
    if (periodFilter === 'today') {
      return itemDate.toDateString() === today.toDateString();
    }
    
    if (periodFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= weekAgo;
    }
    
    if (periodFilter === 'month') {
      return itemDate.getMonth() === today.getMonth() && 
             itemDate.getFullYear() === today.getFullYear();
    }
    
    if (periodFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    }
    
    return true;
  };

  // Aplicar filtros aos dados
  const filteredSoldProducts = useMemo(() => {
    return mockProducts.filter((p) => p.isSold && filterByDate(p.soldAt || ''));
  }, [periodFilter, startDate, endDate]);

  const filteredNewProducts = useMemo(() => {
    return mockProducts.filter((p) => !p.isSold && filterByDate(p.createdAt));
  }, [periodFilter, startDate, endDate]);

  // Gestão de Estoque
  const allProducts = mockProducts.filter((p) => !p.isSold);
  const nearExpiration = allProducts.filter((p) => {
    const category = getExpirationCategory(p.expirationDate);
    return category === 'declarar' || category === 'emergencia';
  }).length;
  
  const expired = 0;
  const newProducts = filteredNewProducts.length;
  
  const lowStock = allProducts.filter((p) => p.quantity < 10).length;
  const lowStockPercentage = ((lowStock / allProducts.length) * 100).toFixed(1);

  // Controle de Vendas
  const soldProducts = filteredSoldProducts;
  const soldToday = soldProducts.filter((p) => {
    const soldDate = new Date(p.soldAt || '');
    const today = new Date();
    return soldDate.toDateString() === today.toDateString();
  }).length;

  const soldThisWeek = soldProducts.filter((p) => {
    const soldDate = new Date(p.soldAt || '');
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return soldDate >= weekAgo;
  }).length;

  const soldThisMonth = soldProducts.filter((p) => {
    const soldDate = new Date(p.soldAt || '');
    const today = new Date();
    return soldDate.getMonth() === today.getMonth() && soldDate.getFullYear() === today.getFullYear();
  }).length;

  const soldWithDiscount = soldProducts.filter((p) => p.currentPrice < p.originalPrice).length;
  const discountSalesPercentage = soldProducts.length > 0 
    ? ((soldWithDiscount / soldProducts.length) * 100).toFixed(1)
    : '0.0';

  const averageTimeToSell = soldProducts.length > 0
    ? soldProducts.reduce((sum, p) => {
        const created = new Date(p.createdAt).getTime();
        const sold = new Date(p.soldAt || '').getTime();
        return sum + Math.floor((sold - created) / (1000 * 60 * 60 * 24));
      }, 0) / soldProducts.length
    : 0;

  // Ações e Promoções
  const totalLabels = mockPromotions.length;
  const activePromotions = mockPromotions.filter((p) => p.isActive).length;
  
  const productsWithPromotion = mockPromotions.length;
  const soldAfterPromotion = soldProducts.filter((p) => p.currentPrice < p.originalPrice).length;
  const promotionSuccessRate = productsWithPromotion > 0
    ? ((soldAfterPromotion / productsWithPromotion) * 100).toFixed(1)
    : '0.0';

  const exportReport = () => {
    alert('Exportando relatório completo...');
  };

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value);
    if (value !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

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
                  <h1 className={styles.title}>Relatórios</h1>
                  <p className={styles.subtitle}>Análises detalhadas do sistema</p>
                </div>
                <Button variant="primary" onClick={exportReport}>
                  <Download size={18} />
                  Exportar Relatório
                </Button>
              </div>

              {/* Filtros */}
              <Card padding="medium">
                <div className={styles.filters}>
                  <h3 className={styles.filterTitle}>Filtros de Período</h3>
                  <div className={styles.filterRow}>
                    <Select
                      value={periodFilter}
                      onChange={handlePeriodChange}
                      options={periodOptions}
                    />
                    {periodFilter === 'custom' && (
                      <>
                        <DatePicker
                          label="Data Início"
                          value={startDate}
                          onChange={setStartDate}
                        />
                        <DatePicker
                          label="Data Fim"
                          value={endDate}
                          onChange={setEndDate}
                          min={startDate}
                        />
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Gestão de Estoque */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Package size={20} />
                  Gestão de Estoque
                </h2>
                <div className={styles.grid}>
                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <AlertTriangle size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Validade Próxima</p>
                        <h3 className={styles.reportValue}>{nearExpiration}</h3>
                        <p className={styles.reportDescription}>Produtos em alerta</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <AlertTriangle size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Produtos Vencidos</p>
                        <h3 className={styles.reportValue}>{expired}</h3>
                        <p className={styles.reportDescription}>Necessitam baixa</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Package size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Novos Lotes</p>
                        <h3 className={styles.reportValue}>{newProducts}</h3>
                        <p className={styles.reportDescription}>No período selecionado</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <TrendingUp size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Estoque Baixo</p>
                        <h3 className={styles.reportValue}>{lowStockPercentage}%</h3>
                        <p className={styles.reportDescription}>{lowStock} produtos</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Controle de Vendas */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <DollarSign size={20} />
                  Controle de Vendas
                </h2>
                <div className={styles.grid}>
                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Calendar size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Vendas Hoje</p>
                        <h3 className={styles.reportValue}>{soldToday}</h3>
                        <p className={styles.reportDescription}>Produtos vendidos</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Calendar size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Vendas Semana</p>
                        <h3 className={styles.reportValue}>{soldThisWeek}</h3>
                        <p className={styles.reportDescription}>Últimos 7 dias</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Calendar size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Vendas Mês</p>
                        <h3 className={styles.reportValue}>{soldThisMonth}</h3>
                        <p className={styles.reportDescription}>Mês atual</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Tag size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Vendas com Desconto</p>
                        <h3 className={styles.reportValue}>{discountSalesPercentage}%</h3>
                        <p className={styles.reportDescription}>{soldWithDiscount} produtos</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <BarChart3 size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Tempo Médio p/ Venda</p>
                        <h3 className={styles.reportValue}>{Math.round(averageTimeToSell)}</h3>
                        <p className={styles.reportDescription}>dias em estoque</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Ações e Promoções */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Tag size={20} />
                  Ações e Promoções
                </h2>
                <div className={styles.grid}>
                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Download size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Etiquetas Criadas</p>
                        <h3 className={styles.reportValue}>{totalLabels}</h3>
                        <p className={styles.reportDescription}>Total de promoções</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <Tag size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Promoções Ativas</p>
                        <h3 className={styles.reportValue}>{activePromotions}</h3>
                        <p className={styles.reportDescription}>Em andamento</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <TrendingUp size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Vendidos c/ Promoção</p>
                        <h3 className={styles.reportValue}>{soldAfterPromotion}</h3>
                        <p className={styles.reportDescription}>No período</p>
                      </div>
                    </div>
                  </Card>

                  <Card padding="medium">
                    <div className={styles.reportCard}>
                      <div className={styles.reportIcon}>
                        <BarChart3 size={28} />
                      </div>
                      <div className={styles.reportContent}>
                        <p className={styles.reportLabel}>Taxa de Sucesso</p>
                        <h3 className={styles.reportValue}>{promotionSuccessRate}%</h3>
                        <p className={styles.reportDescription}>Conversão promoções</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}