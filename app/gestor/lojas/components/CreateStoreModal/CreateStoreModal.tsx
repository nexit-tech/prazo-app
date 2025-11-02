'use client'

import { useState } from 'react'
import Modal from '@/components/Modal/Modal'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import { useStores } from '@/hooks/useStores'
import styles from './CreateStoreModal.module.css'

interface CreateStoreModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateStoreModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateStoreModalProps) {
  const { createStore, generateCode } = useStores()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    address: '',
    phone: '',
  })

  const [errors, setErrors] = useState({
    email: '',
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value })
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Email inválido' })
    } else {
      setErrors({ ...errors, email: '' })
    }
  }

  const handleSubmit = async () => {
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Email inválido' })
      return
    }

    try {
      setLoading(true)
      await createStore({
        code: formData.code,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
        is_active: true,
      })
      onSuccess()
      handleClose()
    } catch (error) {
      alert('Erro ao cadastrar loja. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCode = async () => {
    try {
      const code = await generateCode()
      setFormData({ ...formData, code })
    } catch (error) {
      alert('Erro ao gerar código')
    }
  }

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      email: '',
      address: '',
      phone: '',
    })
    setErrors({ email: '' })
    onClose()
  }

  const isValid = Boolean(
    formData.code &&
    formData.name &&
    formData.email &&
    formData.address &&
    formData.phone &&
    !errors.email
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cadastrar Loja"
      size="large"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Loja'}
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.codeField}>
            <Input
              label="Código da Loja"
              placeholder="Ex: DL001"
              value={formData.code}
              onChange={(value) => setFormData({ ...formData, code: value })}
              fullWidth
              required
            />
            <Button type="button" variant="secondary" onClick={handleGenerateCode}>
              Gerar Código
            </Button>
          </div>
          <Input
            label="Nome da Loja"
            placeholder="Ex: Drogarias Líder - Loja 02"
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
              label="Email"
              placeholder="Ex: loja02@drogaslider.com.br"
              value={formData.email}
              onChange={handleEmailChange}
              fullWidth
              required
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <Input
            label="Telefone"
            placeholder="Ex: (22) 98765-4321"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            fullWidth
            required
          />
        </div>

        <Input
          label="Endereço"
          placeholder="Ex: Rua Principal, 100 - Centro"
          value={formData.address}
          onChange={(value) => setFormData({ ...formData, address: value })}
          fullWidth
          required
        />

        <div className={styles.infoBox}>
          <p className={styles.infoTitle}>📋 Informações Importantes</p>
          <ul className={styles.infoList}>
            <li>O email será usado para comunicações com a loja</li>
            <li>O código da loja deve ser único no sistema</li>
            <li>Após criar, será necessário cadastrar um usuário para acesso</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}