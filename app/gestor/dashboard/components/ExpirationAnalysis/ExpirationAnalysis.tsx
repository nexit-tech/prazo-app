import { AlertTriangle, Package } from 'lucide-react'
import ExpirationCard from './ExpirationCard/ExpirationCard'
import styles from './ExpirationAnalysis.module.css'

interface ExpirationAnalysisProps {
  declarar: number
  emergencia: number
  urgente: number
  poucoUrgente: number
  analise: number
}

export default function ExpirationAnalysis({
  declarar,
  emergencia,
  urgente,
  poucoUrgente,
  analise,
}: ExpirationAnalysisProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Análise por Validade</h2>
        <p className={styles.subtitle}>Distribuição de produtos por urgência de vencimento</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <ExpirationCard
            icon={AlertTriangle}
            label="Declarar Baixa"
            value={declarar}
            description="1-15 dias"
            variant="declarar"
          />
        </div>
        <div className={styles.card}>
          <ExpirationCard
            icon={AlertTriangle}
            label="Emergência"
            value={emergencia}
            description="16-29 dias"
            variant="emergencia"
          />
        </div>
        <div className={styles.card}>
          <ExpirationCard
            icon={AlertTriangle}
            label="Urgente"
            value={urgente}
            description="30-59 dias"
            variant="urgente"
          />
        </div>
        <div className={styles.card}>
          <ExpirationCard
            icon={Package}
            label="Pouco Urgente"
            value={poucoUrgente}
            description="60-89 dias"
            variant="poucoUrgente"
          />
        </div>
        <div className={styles.card}>
          <ExpirationCard
            icon={Package}
            label="Em Análise"
            value={analise}
            description="90+ dias"
            variant="analise"
          />
        </div>
      </div>
    </section>
  )
}