import { useState, useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useStores } from '@/hooks/useStores'
import { storesService, StoreWithUser } from '@/services/stores.service'
import { authService } from '@/services/auth.service'
import styles from './EditStoreModal.module.css'

interface EditStoreModalProps {
  isOpen: boolean
  onClose: () => void
  storeId: string
  onSuccess: () => void
}

export default function EditStoreModal({
  isOpen,
  onClose,
  storeId,
  onSuccess,
}: EditStoreModalProps) {
  const { updateStore, getStoreWithUser } = useStores()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [store, setStore] = useState<StoreWithUser | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    address: '',
    phone: '',
    userEmail: '',
    userPassword: '',
    userName: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    userEmail: '',
    code: '',
  })

  useEffect(() => {
    if (isOpen && storeId) {
      loadStore()
    }
  }, [isOpen, storeId])

  const loadStore = async () => {
    try {
      setLoading(true)
      const data = await getStoreWithUser(storeId)
      setStore(data)
      setFormData({
        code: data.code,
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        userEmail: data.user_email || '',
        userPassword: '',
        userName: '',
      })
    } catch (error) {
      console.error('Erro ao carregar loja:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string, field: 'email' | 'userEmail') => {
    setFormData({ ...formData, [field]: value })
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, [field]: 'Email inválido' })
    } else {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleCodeChange = async (value: string) => {
    setFormData({ ...formData, code: value })
    if (value && value !== store?.code) {
      const exists = await storesService.checkCodeExists(value, storeId)
      if (exists) {
        setErrors({ ...errors, code: 'Código já existe' })
      } else {
        setErrors({ ...errors, code: '' })
      }
    } else {
      setErrors({ ...errors, code: '' })
    }
  }

  const handleSubmit = async () => {
    if (!isValid) return

    try {
      setSaving(true)

      await updateStore(storeId, {
        code: formData.code,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
      })

      if (store?.user_id) {
        const userUpdates: { email?: string; password?: string; fullName?: string } = {}
        
        if (formData.userEmail && formData.userEmail !== store.user_email) {
          userUpdates.email = formData.userEmail
        }
        
        if (formData.userPassword) {
          userUpdates.password = formData.userPassword
        }

        if (formData.userName) {
          userUpdates.fullName = formData.userName
        }

        if (Object.keys(userUpdates).length > 0) {
          await authService.updateStoreUser(store.user_id, userUpdates)
        }
      }

      onSuccess()
      handleClose()
    } catch (error) {
      alert('Erro ao atualizar loja. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      email: '',
      address: '',
      phone: '',
      userEmail: '',
      userPassword: '',
      userName: '',
    })
    setErrors({ email: '', userEmail: '', code: '' })
    setStore(null)
    onClose()
  }

  const isValid = Boolean(
    formData.code &&
    formData.name &&
    formData.email &&
    formData.address &&
    formData.phone &&
    !errors.email &&
    !errors.userEmail &&
    !errors.code
  )

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Loja"
      size="large"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || saving}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </>
      }
    >
      {loading ? (
        <LoadingSpinner size="medium" />
      ) : (
        <div className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informações da Loja</h3>
            <div className={styles.row}>
              <div className={styles.inputWithError}>
                <Input
                  label="Código da Loja"
                  placeholder="Ex: DL001"
                  value={formData.code}
                  onChange={handleCodeChange}
                  fullWidth
                  required
                  disabled={saving}
                />
                {errors.code && <span className={styles.error}>{errors.code}</span>}
              </div>
              <Input
                label="Nome da Loja"
                placeholder="Ex: Drogarias Líder - Loja 02"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                fullWidth
                required
                disabled={saving}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputWithError}>
                <Input
                  type="email"
                  label="Email da Loja"
                  placeholder="Ex: loja02@drogaslider.com.br"
                  value={formData.email}
                  onChange={(value) => handleEmailChange(value, 'email')}
                  fullWidth
                  required
                  disabled={saving}
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
                disabled={saving}
              />
            </div>

            <Input
              label="Endereço"
              placeholder="Ex: Rua Principal, 100 - Centro"
              value={formData.address}
              onChange={(value) => setFormData({ ...formData, address: value })}
              fullWidth
              required
              disabled={saving}
            />
          </div>

          {store?.user_id && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Atualizar Usuário de Acesso</h3>
              <div className={styles.infoBox}>
                <p className={styles.infoText}>
                  Preencha apenas os campos que deseja alterar
                </p>
              </div>
              <div className={styles.row}>
                <div className={styles.inputWithError}>
                  <Input
                    type="email"
                    label="Email de Acesso"
                    placeholder="Deixe vazio para não alterar"
                    value={formData.userEmail}
                    onChange={(value) => handleEmailChange(value, 'userEmail')}
                    fullWidth
                    disabled={saving}
                  />
                  {errors.userEmail && <span className={styles.error}>{errors.userEmail}</span>}
                </div>
                <Input
                  type="password"
                  label="Nova Senha"
                  placeholder="Deixe vazio para não alterar"
                  value={formData.userPassword}
                  onChange={(value) => setFormData({ ...formData, userPassword: value })}
                  fullWidth
                  disabled={saving}
                />
              </div>
              <Input
                label="Nome Completo"
                placeholder="Deixe vazio para não alterar"
                value={formData.userName}
                onChange={(value) => setFormData({ ...formData, userName: value })}
                fullWidth
                disabled={saving}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}