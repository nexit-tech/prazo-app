import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'gestor@prazo.com',
    password: 'gestor123',
    role: 'gestor',
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'loja01@prazo.com',
    password: 'loja123',
    role: 'loja',
    storeId: 'store-1',
  },
  {
    id: '3',
    name: 'João Pereira',
    email: 'loja02@prazo.com',
    password: 'loja123',
    role: 'loja',
    storeId: 'store-2',
  },
  {
    id: '4',
    name: 'Maria Santos',
    email: 'loja03@prazo.com',
    password: 'loja123',
    role: 'loja',
    storeId: 'store-3',
  },
];