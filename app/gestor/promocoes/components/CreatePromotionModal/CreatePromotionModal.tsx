'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal/Modal';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import Button from '@/components/Button/Button';
import { mockProducts } from '@/mocks/products';
import { mockStores } from '@/mocks/stores';
import styles from './CreatePromotionModal.module.css';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreatePromotionModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePromotionModalProps) {
  const [formData, setFormData] = useState({
    productId: '',
    storeId: '',
    discount: '',
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const productOptions = mockProducts
    .filter((p) => !p.isSold)
    .map((p) => ({
      value: p.id,
      label: `${p.name} - ${p.brand} (${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(p.currentPrice)})`,
    }));

  const storeOptions = mockStores.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  useEffect(() => {
    if (formData.productId) {
      const product = mockProducts.find((p) => p.id === formData.productId);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId]);

  useEffect(() => {
    if (selectedProduct && formData.discount) {
      const discountValue = parseFloat(formData.discount);
      const newPrice = selectedProduct.currentPrice * (1 - discountValue / 100);
      setCalculatedPrice(newPrice);
    } else {
      setCalculatedPrice(0);
    }
  }, [selectedProduct, formData.discount]);

  const handleSubmit = () => {
    const newBarcode = `PROMO${Date.now()}`;
    const newInternalCode = `${selectedProduct.internalCode}-PROMO`;

    const promotionData = {
      productId: formData.productId,
      storeId: formData.storeId,
      discount: parseFloat(formData.discount),
      newPrice: calculatedPrice,
      newBarcode,
      newInternalCode,
      isVisible: true,
      isActive: true,
    };

    onSubmit(promotionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      productId: '',
      storeId: '',
      discount: '',
    });
    setSelectedProduct(null);
    setCalculatedPrice(0);
    onClose();
  };

  const isValid = Boolean(formData.productId && formData.storeId && formData.discount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Nova Promoção"
      size="large"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Criar Promoção
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.infoBox}>
          Selecione um produto e defina o desconto para criar uma promoção
        </div>

        <Select
          label="Produto"
          value={formData.productId}
          onChange={(value) => setFormData({ ...formData, productId: value })}
          options={productOptions}
          placeholder="Selecione um produto"
          required
          fullWidth
        />

        <div className={styles.row}>
          <Select
            label="Loja"
            value={formData.storeId}
            onChange={(value) => setFormData({ ...formData, storeId: value })}
            options={storeOptions}
            placeholder="Selecione uma loja"
            required
            fullWidth
          />

          <Input
            type="number"
            label="Desconto (%)"
            placeholder="Ex: 20"
            value={formData.discount}
            onChange={(value) => setFormData({ ...formData, discount: value })}
            required
            fullWidth
          />
        </div>

        {selectedProduct && formData.discount && (
          <div className={styles.pricePreview}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Preço Original:</span>
              <span className={`${styles.priceValue} ${styles.oldPrice}`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(selectedProduct.currentPrice)}
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Desconto:</span>
              <span className={styles.priceValue}>-{formData.discount}%</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Novo Preço:</span>
              <span className={styles.newPrice}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(calculatedPrice)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}