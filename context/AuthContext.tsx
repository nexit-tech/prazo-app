'use client'

import { createContext } from 'react'
import { AuthUser, LoginCredentials } from '@/services/auth.service'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isGestor: boolean
  isLoja: boolean
  login: (credentials: LoginCredentials, keepLoggedIn: boolean) => Promise<AuthUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)