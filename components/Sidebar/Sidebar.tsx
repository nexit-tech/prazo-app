'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Store, 
  Package, 
  ArrowLeftRight, 
  Tag, 
  TrendingUp,
  Plus,
  AlertTriangle,
  User,
  LogOut,
  LucideIcon
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Store,
  Package,
  ArrowLeftRight,
  Tag,
  TrendingUp,
  Plus,
  AlertTriangle,
};

export default function Sidebar({ menuItems, userName, userRole, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className={styles.logoText}>Prazo</h1>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>
                {IconComponent && <IconComponent size={20} strokeWidth={2} />}
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{userName}</p>
            <p className={styles.userRole}>{userRole}</p>
          </div>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}