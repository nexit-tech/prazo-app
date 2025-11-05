'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, AuthUser, LoginCredentials } from '@/services/auth.service'
import { supabase } from '@/lib/supabase/client'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const userData = await authService.login(credentials)
      setUser(userData)
      
      const targetPath = userData.role === 'gestor' 
        ? '/gestor/dashboard' 
        : '/loja/dashboard'
        
      router.push(targetPath)
      return userData
    } catch (err) {
      setUser(null)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = !!user
  const isGestor = user?.role === 'gestor'
  const isLoja = user?.role === 'loja'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isGestor,
        isLoja,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}