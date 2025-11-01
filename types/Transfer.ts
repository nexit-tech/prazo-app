export interface Transfer {
  id: string;
  productId: string;
  fromStoreId: string;
  toStoreId: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}