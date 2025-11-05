'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) {
      return
    }

    if (user) {
      const targetPath = user.role === 'gestor' 
        ? '/gestor/dashboard' 
        : '/loja/dashboard'
      router.push(targetPath)
    } else {
      router.push('/login')
    }
  }, [user, loading, router])

  return <LoadingSpinner fullScreen text="Carregando..." />
}