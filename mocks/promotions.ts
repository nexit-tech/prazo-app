import { Promotion } from '../types';

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    productId: 'prod-3',
    storeId: 'store-2',
    discount: 20,
    newPrice: 20.00,
    newBarcode: '7891234567899',
    newInternalCode: 'AR001-PROMO',
    startDate: '2025-10-28T00:00:00Z',
    endDate: '2025-11-30T23:59:59Z',
    isVisible: true,
    isActive: true,
    createdBy: '1',
    createdAt: '2025-10-28T10:00:00Z',
  },
  {
    id: 'promo-2',
    productId: 'prod-6',
    storeId: 'store-3',
    discount: 15,
    newPrice: 4.25,
    newBarcode: '7891234567900',
    newInternalCode: 'AC001-PROMO',
    startDate: '2025-10-29T00:00:00Z',
    endDate: '2025-12-15T23:59:59Z',
    isVisible: true,
    isActive: true,
    createdBy: '1',
    createdAt: '2025-10-29T10:00:00Z',
  },
];