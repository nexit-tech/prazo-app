'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, AuthUser, LoginCredentials } from '@/services/auth.service'
import { supabase } from '@/lib/supabase/client'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  children: React.ReactNode
}

const KEEP_LOGGED_IN_KEY = 'prazo-keep-logged-in'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const keepLoggedIn = localStorage.getItem(KEEP_LOGGED_IN_KEY)

    if (keepLoggedIn === 'true') {
      checkUser()
    } else {
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem(KEEP_LOGGED_IN_KEY)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      if (!currentUser) {
        localStorage.removeItem(KEEP_LOGGED_IN_KEY)
      }
    } catch (err) {
      setUser(null)
      localStorage.removeItem(KEEP_LOGGED_IN_KEY)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials, keepLoggedIn: boolean) => {
    try {
      setLoading(true)
      const userData = await authService.login(credentials)
      setUser(userData)
      
      if (keepLoggedIn) {
        localStorage.setItem(KEEP_LOGGED_IN_KEY, 'true')
      } else {
        localStorage.removeItem(KEEP_LOGGED_IN_KEY)
      }
      
      const targetPath = userData.role === 'gestor' 
        ? '/gestor/dashboard' 
        : '/loja/dashboard'
        
      router.push(targetPath)
      return userData
    } catch (err) {
      setUser(null)
      localStorage.removeItem(KEEP_LOGGED_IN_KEY)
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
      localStorage.removeItem(KEEP_LOGGED_IN_KEY)
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