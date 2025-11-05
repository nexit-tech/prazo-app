'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'
import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  const Icon = variant === 'danger' ? AlertTriangle : CheckCircle
  const iconStyle = variant === 'danger' ? styles.dangerIcon : styles.primaryIcon

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Confirmando...' : confirmText}
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        <div className={`${styles.iconWrapper} ${iconStyle}`}>
          <Icon size={32} />
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </Modal>
  )
}