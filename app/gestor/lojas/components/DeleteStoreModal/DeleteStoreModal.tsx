import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import { useStores } from '@/hooks/useStores'
import styles from './DeleteStoreModal.module.css'

interface DeleteStoreModalProps {
  isOpen: boolean
  onClose: () => void
  store: {
    id: string
    name: string
    code: string
  } | null
  onSuccess: () => void
}

export default function DeleteStoreModal({
  isOpen,
  onClose,
  store,
  onSuccess,
}: DeleteStoreModalProps) {
  const { deleteStore } = useStores()
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (!store) return

    try {
      setLoading(true)
      await deleteStore(store.id)
      onSuccess()
      handleClose()
    } catch (error) {
      alert('Erro ao excluir loja. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  const isConfirmed = confirmText.toUpperCase() === 'EXCLUIR'

  if (!isOpen || !store) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Excluir Loja"
      size="medium"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={!isConfirmed || loading}
          >
            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={styles.warningIcon}>
          <AlertTriangle size={48} />
        </div>

        <div className={styles.message}>
          <h3 className={styles.messageTitle}>Atenção! Esta ação é irreversível</h3>
          <p className={styles.messageText}>
            Você está prestes a excluir a loja <strong>{store.name}</strong> (Código: <strong>{store.code}</strong>).
          </p>
        </div>

        <div className={styles.warningBox}>
          <h4 className={styles.warningTitle}>O que será excluído:</h4>
          <ul className={styles.warningList}>
            <li>Dados da loja</li>
            <li>Usuário de acesso vinculado</li>
            <li>Todos os produtos cadastrados</li>
            <li>Histórico de vendas</li>
            <li>Promoções ativas</li>
          </ul>
        </div>

        <div className={styles.confirmSection}>
          <label className={styles.confirmLabel}>
            Digite <strong>EXCLUIR</strong> para confirmar:
          </label>
          <input
            type="text"
            className={styles.confirmInput}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Digite EXCLUIR"
            disabled={loading}
            autoComplete="off"
          />
        </div>
      </div>
    </Modal>
  )
}