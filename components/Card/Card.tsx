import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  padding?: 'small' | 'medium' | 'large';
  centered?: boolean;
}

export default function Card({
  children,
  title,
  subtitle,
  padding = 'medium',
  centered = false,
}: CardProps) {
  return (
    <div className={`${styles.card} ${styles[padding]} ${centered ? styles.centered : ''}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}