import { useState, useEffect } from 'react'
import { Store, MapPin, Mail, Phone, User, Key, Calendar } from 'lucide-react'
import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import { useStores } from '@/hooks/useStores'
import { StoreWithUser } from '@/services/stores.service'
import { formatDate } from '@/utils/dateHelpers'
import styles from './ViewStoreModal.module.css'

interface ViewStoreModalProps {
  isOpen: boolean
  onClose: () => void
  storeId: string
}

export default function ViewStoreModal({
  isOpen,
  onClose,
  storeId,
}: ViewStoreModalProps) {
  const { getStoreWithUser } = useStores()
  const [store, setStore] = useState<StoreWithUser | null>(null)
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Erro ao carregar loja:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStore(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Detalhes da Loja"
      size="large"
      footer={
        <Button variant="outline" onClick={handleClose}>
          Fechar
        </Button>
      }
    >
      {loading ? (
        <LoadingSpinner size="medium" />
      ) : store ? (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Store size={18} />
              Informações da Loja
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Código</label>
                <p className={styles.value}>{store.code}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nome</label>
                <p className={styles.value}>{store.name}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <div className={styles.statusBadge}>
                  <span className={store.is_active ? styles.active : styles.inactive}>
                    {store.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <MapPin size={18} />
              Contato e Localização
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>
                  <Mail size={14} />
                  Email
                </label>
                <p className={styles.value}>{store.email}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <Phone size={14} />
                  Telefone
                </label>
                <p className={styles.value}>{store.phone}</p>
              </div>
              <div className={styles.fieldFull}>
                <label className={styles.label}>
                  <MapPin size={14} />
                  Endereço
                </label>
                <p className={styles.value}>{store.address}</p>
              </div>
            </div>
          </div>

          {store.user_email && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <User size={18} />
                Usuário de Acesso
              </h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    <Key size={14} />
                    Email de Acesso
                  </label>
                  <p className={styles.value}>{store.user_email}</p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Calendar size={18} />
              Informações de Cadastro
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Data de Cadastro</label>
                <p className={styles.value}>{formatDate(store.created_at)}</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Última Atualização</label>
                <p className={styles.value}>{formatDate(store.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.error}>
          <p>Erro ao carregar informações da loja</p>
        </div>
      )}
    </Modal>
  )
}