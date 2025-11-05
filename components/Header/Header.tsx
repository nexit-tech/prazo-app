'use client'

import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  const userName = user?.fullName || 'Usuário';
  const userRole = user?.role === 'gestor' ? 'Gestor' : 'Loja';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h1 className={styles.logoText}>Prazo</h1>
        </div>

        <div className={styles.right}>
          <div className={styles.userSection}>
            <div className={styles.avatar}>
              <User size={18} />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{userName}</p>
              <p className={styles.userRole}>{userRole}</p>
            </div>
          </div>

          <button onClick={logout} className={styles.logoutButton}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}