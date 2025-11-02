'use client'

import { useState, useEffect } from 'react'
import { promotionsService, PromotionFilters } from '@/services/promotions.service'
import { Database } from '@/lib/supabase/types'

type Promotion = Database['public']['Tables']['promotions']['Row']
type PromotionInsert = Database['public']['Tables']['promotions']['Insert']
type PromotionUpdate = Database['public']['Tables']['promotions']['Update']

export const usePromotions = (filters?: PromotionFilters) => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPromotions()
  }, [filters?.storeId, filters?.isActive, filters?.isVisible])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await promotionsService.getAll(filters)
      setPromotions(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar promoções'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createPromotion = async (promotion: PromotionInsert) => {
    try {
      setLoading(true)
      setError(null)
      const newPromotion = await promotionsService.create(promotion)
      setPromotions(prev => [newPromotion, ...prev])
      return newPromotion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar promoção'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePromotion = async (id: string, updates: PromotionUpdate) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await promotionsService.update(id, updates)
      setPromotions(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar promoção'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePromotion = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await promotionsService.delete(id)
      setPromotions(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar promoção'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await promotionsService.toggleVisibility(id, isVisible)
      setPromotions(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar visibilidade'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await promotionsService.toggleActive(id, isActive)
      setPromotions(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchPromotions()
  }

  return {
    promotions,
    loading,
    error,
    createPromotion,
    updatePromotion,
    deletePromotion,
    toggleVisibility,
    toggleActive,
    refresh,
  }
}