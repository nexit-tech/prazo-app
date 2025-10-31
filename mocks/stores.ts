export interface Store {
  id: string;
  code: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export const mockStores: Store[] = [
  {
    id: 'store-1',
    code: 'FL001',
    name: 'Filial Centro',
    email: 'filial.centro@empresa.com',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 98765-4321',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'store-2',
    code: 'FL002',
    name: 'Filial Norte',
    email: 'filial.norte@empresa.com',
    address: 'Av. Principal, 456 - Zona Norte',
    phone: '(11) 98765-4322',
    isActive: true,
    createdAt: '2024-02-10',
  },
  {
    id: 'store-3',
    code: 'FL003',
    name: 'Filial Sul',
    email: 'filial.sul@empresa.com',
    address: 'Rua do Comércio, 789 - Zona Sul',
    phone: '(11) 98765-4323',
    isActive: true,
    createdAt: '2024-03-05',
  },
];