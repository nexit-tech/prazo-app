import { LogOut, User } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export default function Header({ userName, userRole, onLogout }: HeaderProps) {
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

          <button onClick={onLogout} className={styles.logoutButton}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}