'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './TableSort.module.css';

export type SortOrder = 'asc' | 'desc' | null;

interface TableSortProps {
  column: string;
  currentColumn: string | null;
  currentOrder: SortOrder;
  onSort: (column: string) => void;
  label: string;
}

export default function TableSort({
  column,
  currentColumn,
  currentOrder,
  onSort,
  label,
}: TableSortProps) {
  const isActive = currentColumn === column;

  return (
    <button
      type="button"
      className={`${styles.sortButton} ${isActive ? styles.active : ''}`}
      onClick={() => onSort(column)}
    >
      <span>{label}</span>
      {!isActive && <ArrowUpDown size={14} className={styles.icon} />}
      {isActive && currentOrder === 'asc' && <ArrowUp size={14} className={styles.icon} />}
      {isActive && currentOrder === 'desc' && <ArrowDown size={14} className={styles.icon} />}
    </button>
  );
}