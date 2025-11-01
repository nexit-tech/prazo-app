'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Store } from 'lucide-react';
import Button from '@/components/Button/Button';
import { mockUsers } from '@/mocks/users';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setError('Email ou senha inválidos');
        setLoading(false);
        return;
      }

      if (user.role === 'gestor') {
        router.push('/gestor/dashboard');
      } else {
        router.push('/loja/dashboard');
      }
    }, 800);
  };

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

            <h2 className={styles.title}>Criar uma conta</h2>
            <p className={styles.subtitle}>
              Acesse suas tarefas, notas e projetos a qualquer momento, em qualquer lugar - e mantenha tudo fluindo em um só lugar.
            </p>

            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Seu email</label>
                <div className={styles.inputGroup}>
                  <Mail size={20} className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="seuemail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? 'Entrando...' : 'Começar'}
              </Button>
            </form>

            <div className={styles.demo}>
              <p className={styles.demoTitle}>Contas de demonstração:</p>
              <p className={styles.demoText}>
                <strong>Gestor:</strong> gestor@prazo.com / gestor123
              </p>
              <p className={styles.demoText}>
                <strong>Loja:</strong> loja01@prazo.com / loja123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}