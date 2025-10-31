'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';
import DatePicker from '@/components/DatePicker/DatePicker';
import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput';
import Button from '@/components/Button/Button';
import styles from './page.module.css';

export default function LojaCadastrarPage() {
  const router = useRouter();
  const [userName] = useState('Ana Costa');

  const [categories, setCategories] = useState([
    { value: 'laticinios', label: 'Laticínios' },
    { value: 'padaria', label: 'Padaria' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'bebidas', label: 'Bebidas' },
    { value: 'higiene', label: 'Higiene' },
    { value: 'limpeza', label: 'Limpeza' },
    { value: 'hortifruti', label: 'Hortifruti' },
    { value: 'outros', label: 'Outros' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    barcode: '',
    internalCode: '',
    quantity: '',
    price: '',
    expirationDate: '',
    batch: '',
  });

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

  const handleCreateCategory = (newCategory: string) => {
    const categoryValue = newCategory.toLowerCase().replace(/\s+/g, '-');
    const newCategoryOption = {
      value: categoryValue,
      label: newCategory,
    };
    setCategories([...categories, newCategoryOption]);
    setFormData({ ...formData, category: categoryValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Produto cadastrado com sucesso!');
    router.push('/loja/produtos');
  };

  const today = new Date().toISOString().split('T')[0];

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
                <h1 className={styles.title}>Cadastrar Produto</h1>
                <p className={styles.subtitle}>Adicione um novo produto ao estoque</p>
              </div>

              <Card padding="large">
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.row}>
                    <Input
                      label="Nome do Produto"
                      placeholder="Ex: Leite Integral 1L"
                      value={formData.name}
                      onChange={(value) => setFormData({ ...formData, name: value })}
                      fullWidth
                      required
                    />
                    <Input
                      label="Marca"
                      placeholder="Ex: Marca A"
                      value={formData.brand}
                      onChange={(value) => setFormData({ ...formData, brand: value })}
                      fullWidth
                      required
                    />
                  </div>

                  <div className={styles.row}>
                    <AutocompleteInput
                      label="Categoria"
                      placeholder="Digite ou selecione uma categoria"
                      value={formData.category}
                      onChange={(value) => setFormData({ ...formData, category: value })}
                      options={categories}
                      onCreateNew={handleCreateCategory}
                      fullWidth
                      required
                    />
                    <Input
                      label="Lote"
                      placeholder="Ex: LT20251105"
                      value={formData.batch}
                      onChange={(value) => setFormData({ ...formData, batch: value })}
                      fullWidth
                      required
                    />
                  </div>

                  <div className={styles.row}>
                    <Input
                      label="Código de Barras"
                      placeholder="Ex: 7891234567890"
                      value={formData.barcode}
                      onChange={(value) => setFormData({ ...formData, barcode: value })}
                      fullWidth
                      required
                    />
                    <Input
                      label="Código Interno"
                      placeholder="Ex: LT001"
                      value={formData.internalCode}
                      onChange={(value) => setFormData({ ...formData, internalCode: value })}
                      fullWidth
                      required
                    />
                  </div>

                  <div className={styles.row}>
                    <Input
                      type="number"
                      label="Quantidade"
                      placeholder="Ex: 50"
                      value={formData.quantity}
                      onChange={(value) => setFormData({ ...formData, quantity: value })}
                      fullWidth
                      required
                    />
                    <Input
                      type="number"
                      label="Preço (R$)"
                      placeholder="Ex: 4.50"
                      value={formData.price}
                      onChange={(value) => setFormData({ ...formData, price: value })}
                      fullWidth
                      required
                    />
                  </div>

                  <DatePicker
                    label="Data de Validade"
                    value={formData.expirationDate}
                    onChange={(value) => setFormData({ ...formData, expirationDate: value })}
                    min={today}
                    fullWidth
                    required
                  />

                  <div className={styles.buttonGroup}>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                      Cadastrar Produto
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}