export type UserRole = 'gestor' | 'loja';

export type ExpirationCategory = 'declarar' | 'emergencia' | 'urgente' | 'pouco-urgente' | 'analise';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  storeId?: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  managerId: string;
  createdAt: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  barcode: string;
  internalCode: string;
  quantity: number;
  expirationDate: string;
  batch: string;
  originalPrice: number;
  currentPrice: number;
  storeId: string;
  createdAt: string;
  soldAt?: string;
  isSold: boolean;
}

export interface Promotion {
  id: string;
  productId: string;
  storeId: string;
  discount: number;
  newPrice: number;
  newBarcode: string;
  newInternalCode: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Analytics {
  storeId: string;
  period: string;
  totalProducts: number;
  totalSold: number;
  totalRevenue: number;
  productsDeclarar: number;
  productsEmergencia: number;
  productsUrgente: number;
  productsPocoUrgente: number;
  productsAnalise: number;
  categorySales: Record<string, number>;
  generatedAt: string;
}

export interface Label {
  id: string;
  promotionId: string;
  productId: string;
  storeId: string;
  downloadedAt?: string;
  isDownloaded: boolean;
}