'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  fullWidth?: boolean;
  min?: string;
  max?: string;
  placeholder?: string;
}

export default function DatePicker({
  label,
  value,
  onChange,
  required = false,
  fullWidth = false,
  min,
  max,
  placeholder = 'Selecione uma data',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias vazios antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Adicionar todos os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (min) {
      const minDate = new Date(min + 'T00:00:00');
      if (date < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max + 'T00:00:00');
      if (date > maxDate) return true;
    }
    return false;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);

  return (
    <div 
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}
      ref={containerRef}
    >
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        <button
          type="button"
          className={`${styles.inputButton} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className={styles.icon} size={18} />
          <span className={selectedDate ? styles.selectedText : styles.placeholderText}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
        </button>

        {isOpen && (
          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <button type="button" onClick={prevMonth} className={styles.navButton}>
                <ChevronLeft size={18} />
              </button>
              <span className={styles.monthYear}>{monthName}</span>
              <button type="button" onClick={nextMonth} className={styles.navButton}>
                <ChevronRight size={18} />
              </button>
            </div>

            <div className={styles.weekdays}>
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                <div key={index} className={styles.weekday}>
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.days}>
              {days.map((date, index) => (
                <div key={index} className={styles.dayCell}>
                  {date && (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      disabled={isDateDisabled(date)}
                      className={`${styles.day} ${
                        isSelected(date) ? styles.daySelected : ''
                      } ${isToday(date) ? styles.dayToday : ''} ${
                        isDateDisabled(date) ? styles.dayDisabled : ''
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.calendarFooter}>
              <button
                type="button"
                className={styles.todayButton}
                onClick={() => handleDateSelect(new Date())}
              >
                Hoje
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}