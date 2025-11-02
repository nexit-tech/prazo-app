'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'gestor') {
          router.push('/gestor/dashboard')
        } else {
          router.push('/loja/dashboard')
        }
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando..." />
  }

  return null
}