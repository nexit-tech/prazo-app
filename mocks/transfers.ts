import { Transfer } from '@/types';

export const mockTransfers: Transfer[] = [
  {
    id: 'trans-1',
    productId: 'prod-1',
    fromStoreId: 'store-1',
    toStoreId: 'store-2',
    quantity: 10,
    status: 'pending',
    requestedAt: '2025-10-28T14:30:00Z',
  },
  {
    id: 'trans-2',
    productId: 'prod-3',
    fromStoreId: 'store-2',
    toStoreId: 'store-3',
    quantity: 5,
    status: 'approved',
    requestedAt: '2025-10-25T10:00:00Z',
    approvedAt: '2025-10-26T09:00:00Z',
    approvedBy: '1',
  },
  {
    id: 'trans-3',
    productId: 'prod-5',
    fromStoreId: 'store-3',
    toStoreId: 'store-1',
    quantity: 15,
    status: 'rejected',
    requestedAt: '2025-10-24T16:00:00Z',
    approvedAt: '2025-10-25T08:00:00Z',
    approvedBy: '1',
  },
  {
    id: 'trans-4',
    productId: 'prod-4',
    fromStoreId: 'store-2',
    toStoreId: 'store-1',
    quantity: 8,
    status: 'pending',
    requestedAt: '2025-10-29T11:00:00Z',
  },
];