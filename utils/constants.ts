export const COLORS = {
  white: '#F2F2F2',
  lightGray: '#D6D6D6',
  gray: '#B9B9B9',
  mediumGray: '#9D9D9D',
  darkGray: '#808080',
  black: '#1D1D1D',
};

export const ALERT_COLORS = {
  expired: '#E74C3C',
  warning: '#F39C12',
  safe: '#3498DB',
};

export const ROUTES = {
  login: '/login',
  gestorDashboard: '/gestor/dashboard',
  lojaDashboard: '/loja/dashboard',
};

export const EXPIRATION_DAYS = {
  expired: 0,
  critical: 3,
  warning: 7,
  safe: 30,
};

export const USER_ROLES = {
  gestor: 'gestor',
  loja: 'loja',
} as const;

export const TRANSFER_STATUS = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
} as const;