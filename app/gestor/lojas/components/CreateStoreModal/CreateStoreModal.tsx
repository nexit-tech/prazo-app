import { useState } from 'react'
import Modal from '@/components/Modal/Modal'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import { useStores } from '@/hooks/useStores'
import { authService } from '@/services/auth.service'
import { storesService } from '@/services/stores.service'
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
  const [step, setStep] = useState<1 | 2>(1)

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
    if (value) {
      const exists = await storesService.checkCodeExists(value)
      if (exists) {
        setErrors({ ...errors, code: 'Código já existe' })
      } else {
        setErrors({ ...errors, code: '' })
      }
    } else {
      setErrors({ ...errors, code: '' })
    }
  }

  const handleGenerateCode = async () => {
    try {
      const code = await generateCode()
      setFormData({ ...formData, code })
      setErrors({ ...errors, code: '' })
    } catch (error) {
      alert('Erro ao gerar código')
    }
  }

  const handleNextStep = () => {
    if (isStep1Valid) {
      setStep(2)
    }
  }

  const handlePreviousStep = () => {
    setStep(1)
  }

  const handleSubmit = async () => {
    if (!isStep2Valid) return

    try {
      setLoading(true)

      const newStore = await createStore({
        code: formData.code,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
        is_active: true,
      })

      await authService.createStoreUser({
        email: formData.userEmail,
        password: formData.userPassword,
        fullName: formData.userName,
        storeId: newStore.id,
      })

      onSuccess()
      handleClose()
    } catch (error) {
      alert('Erro ao cadastrar loja. Tente novamente.')
    } finally {
      setLoading(false)
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
    setStep(1)
    onClose()
  }

  const isStep1Valid = Boolean(
    formData.code &&
    formData.name &&
    formData.email &&
    formData.address &&
    formData.phone &&
    !errors.email &&
    !errors.code
  )

  const isStep2Valid = Boolean(
    formData.userEmail &&
    formData.userPassword &&
    formData.userName &&
    !errors.userEmail &&
    formData.userPassword.length >= 6
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Cadastrar Loja - Etapa ${step} de 2`}
      size="large"
      footer={
        <>
          {step === 2 && (
            <Button variant="outline" onClick={handlePreviousStep} disabled={loading}>
              Voltar
            </Button>
          )}
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          {step === 1 ? (
            <Button 
              variant="primary" 
              onClick={handleNextStep}
              disabled={!isStep1Valid}
            >
              Próximo
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!isStep2Valid || loading}
            >
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.form}>
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Informações da Loja</h3>
              <div className={styles.row}>
                <div className={styles.codeField}>
                  <div className={styles.inputWithError}>
                    <Input
                      label="Código da Loja"
                      placeholder="Ex: DL001"
                      value={formData.code}
                      onChange={handleCodeChange}
                      fullWidth
                      required
                    />
                    {errors.code && <span className={styles.error}>{errors.code}</span>}
                  </div>
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
                    onChange={(value) => handleEmailChange(value, 'email')}
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
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Criar Usuário de Acesso</h3>
              <div className={styles.infoBox}>
                <p className={styles.infoText}>
                  Este usuário será usado para acessar o sistema como gerente da loja
                </p>
              </div>
              <Input
                label="Nome Completo"
                placeholder="Ex: Maria Silva"
                value={formData.userName}
                onChange={(value) => setFormData({ ...formData, userName: value })}
                fullWidth
                required
              />
              <div className={styles.inputWithError}>
                <Input
                  type="email"
                  label="Email de Acesso"
                  placeholder="Ex: maria@drogaslider.com.br"
                  value={formData.userEmail}
                  onChange={(value) => handleEmailChange(value, 'userEmail')}
                  fullWidth
                  required
                />
                {errors.userEmail && <span className={styles.error}>{errors.userEmail}</span>}
              </div>
              <Input
                type="password"
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                value={formData.userPassword}
                onChange={(value) => setFormData({ ...formData, userPassword: value })}
                fullWidth
                required
              />
              {formData.userPassword && formData.userPassword.length < 6 && (
                <span className={styles.error}>A senha deve ter no mínimo 6 caracteres</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}