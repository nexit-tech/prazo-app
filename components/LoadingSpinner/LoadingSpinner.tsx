import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'medium',
  text = 'Carregando...',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const containerClass = `${styles.spinnerOverlay} ${
    !fullScreen ? styles.inline : ''
  } ${styles[size]}`;

  return (
    <div className={containerClass}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        {text && <p className={styles.spinnerText}>{text}</p>}
      </div>
    </div>
  );
}