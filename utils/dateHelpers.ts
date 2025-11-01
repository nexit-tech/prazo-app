export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(expirationDate: string): string {
  const days = getDaysUntilExpiration(expirationDate);
  
  if (days < 0) {
    return `Vencido há ${Math.abs(days)} dia${Math.abs(days) !== 1 ? 's' : ''}`;
  }
  
  if (days === 0) {
    return 'Vence hoje';
  }
  
  if (days === 1) {
    return 'Vence amanhã';
  }
  
  return `${days} dias restantes`;
}

export function getExpirationCategory(expirationDate: string): 'declarar' | 'emergencia' | 'urgente' | 'pouco-urgente' | 'analise' {
  const days = getDaysUntilExpiration(expirationDate);
  
  if (days <= 0) return 'declarar';
  if (days >= 1 && days <= 15) return 'declarar';
  if (days >= 16 && days <= 29) return 'emergencia';
  if (days >= 30 && days <= 59) return 'urgente';
  if (days >= 60 && days <= 89) return 'pouco-urgente';
  return 'analise';
}

export function getExpirationLabel(category: string): string {
  const labels: Record<string, string> = {
    declarar: 'Declarar Baixa',
    emergencia: 'Emergência',
    urgente: 'Urgente',
    'pouco-urgente': 'Pouco Urgente',
    analise: 'Em Análise',
  };
  
  return labels[category] || 'N/A';
}

export function getExpirationColor(category: string): string {
  const colors: Record<string, string> = {
    declarar: '#E74C3C',
    emergencia: '#E67E22',
    urgente: '#F39C12',
    'pouco-urgente': '#3498DB',
    analise: '#2ECC71',
  };
  
  return colors[category] || '#95A5A6';
}

export function getExpirationBadgeVariant(category: string): 'danger' | 'warning' | 'info' | 'success' | 'default' {
  const variants: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'default'> = {
    declarar: 'danger',
    emergencia: 'danger',
    urgente: 'warning',
    'pouco-urgente': 'info',
    analise: 'success',
  };
  
  return variants[category] || 'default';
}