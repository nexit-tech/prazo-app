'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, AuthUser, LoginCredentials } from '@/services/auth.service'
import { supabase } from '@/lib/supabase/client'

export const useAuth = () => {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email)
      
      if (session) {
        await checkUser()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      console.log('👤 Current user:', currentUser)
      setUser(currentUser)
    } catch (err) {
      console.error('❌ Erro ao verificar usuário:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔐 Iniciando login...')
      
      const userData = await authService.login(credentials)
      
      console.log('✅ Login completo, definindo usuário:', userData)
      
      setUser(userData)

      await new Promise(resolve => setTimeout(resolve, 500))

      const targetPath = userData.role === 'gestor' ? '/gestor/dashboard' : '/loja/dashboard'
      
      console.log('🔀 Redirecionando para:', targetPath)
      
      window.location.href = targetPath
      
    } catch (err) {
      console.error('❌ Erro no login:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
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
      window.location.href = '/login'
    } catch (err) {
      setError('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isGestor: user?.role === 'gestor',
    isLoja: user?.role === 'loja',
  }
}