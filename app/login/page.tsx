'use client'

import { useState } from 'react'
import { Mail, Lock, Store } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/Button/Button'
import Checkbox from '@/components/Checkbox/Checkbox'
import styles from './page.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLocalError(null)
    
    try {
      await login({ email, password }, keepLoggedIn)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setLocalError(errorMessage)
      setIsLoggingIn(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.logoIcon}>
              <Store size={48} strokeWidth={2.5} />
            </div>
            <h2 className={styles.leftTitle}>Você pode facilmente</h2>
            <h1 className={styles.leftHeading}>
              Tenha acesso ao seu hub pessoal para clareza e produtividade
            </h1>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.rightContent}>
            <div className={styles.brandIcon}>
              <Store size={32} strokeWidth={2.5} />
            </div>

            <h2 className={styles.title}>Acessar Sistema</h2>
            <p className={styles.subtitle}>
              Entre com suas credenciais para acessar o sistema de gestão.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputGroup}>
                  <Mail size={20} className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="seuemail@drogaslider.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                    disabled={isLoggingIn}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.label}>Senha</label>
                <div className={styles.inputGroup}>
                  <Lock size={20} className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                    disabled={isLoggingIn}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Checkbox
                id="keepLoggedIn"
                label="Mantenha-me conectado"
                checked={keepLoggedIn}
                onChange={setKeepLoggedIn}
              />

              {localError && <p className={styles.error}>{localError}</p>}

              <Button type="submit" variant="primary" fullWidth disabled={isLoggingIn}>
                {isLoggingIn ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}