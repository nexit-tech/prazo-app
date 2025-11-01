'use client';

import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import styles from './CreateStoreModal.module.css';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreateStoreModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateStoreModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    email: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Email inválido' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    if (value && !validatePassword(value)) {
      setErrors({ ...errors, password: 'A senha deve ter no mínimo 6 caracteres' });
    } else {
      setErrors({ ...errors, password: '' });
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setFormData({ ...formData, confirmPassword: value });
    if (value && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: 'As senhas não coincidem' });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleSubmit = () => {
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Email inválido' });
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors({ ...errors, password: 'A senha deve ter no mínimo 6 caracteres' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'As senhas não coincidem' });
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const generateCode = () => {
    const prefix = 'FL';
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData({ ...formData, code: `${prefix}${number}` });
  };

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phone: '',
    });
    setErrors({
      password: '',
      confirmPassword: '',
      email: '',
    });
    onClose();
  };

  const isValid = Boolean(
    formData.code &&
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.address &&
    formData.phone &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cadastrar Loja"
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
            Cadastrar Loja
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.codeField}>
            <Input
              label="Código da Loja"
              placeholder="Ex: FL001"
              value={formData.code}
              onChange={(value) => setFormData({ ...formData, code: value })}
              fullWidth
              required
            />
            <Button type="button" variant="secondary" onClick={generateCode}>
              Gerar Código
            </Button>
          </div>
          <Input
            label="Nome da Loja"
            placeholder="Ex: Filial Centro"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            fullWidth
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputWithError}>
            <Input
              type="email"
              label="Email de Acesso"
              placeholder="Ex: filial.centro@empresa.com"
              value={formData.email}
              onChange={handleEmailChange}
              fullWidth
              required
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <Input
            label="Telefone"
            placeholder="Ex: (11) 98765-4321"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            fullWidth
            required
          />
        </div>

        <Input
          label="Endereço"
          placeholder="Ex: Rua das Flores, 123 - Centro"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          fullWidth
          required
        />

        <div className={styles.divider}>
          <span className={styles.dividerText}>Credenciais de Acesso</span>
        </div>

        <div className={styles.row}>
          <div className={styles.inputWithError}>
            <Input
              type="password"
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handlePasswordChange}
              fullWidth
              required
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          <div className={styles.inputWithError}>
            <Input
              type="password"
              label="Confirmar Senha"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              fullWidth
              required
            />
            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
          </div>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoTitle}>📋 Informações Importantes</p>
          <ul className={styles.infoList}>
            <li>O email será usado como login de acesso da loja</li>
            <li>A senha deve ter no mínimo 6 caracteres</li>
            <li>O código da loja deve ser único no sistema</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}