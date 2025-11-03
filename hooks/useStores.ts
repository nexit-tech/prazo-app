import { useState, useEffect } from 'react'
import { storesService, StoreFilters, StoreWithUser } from '@/services/stores.service'
import { Database } from '@/lib/supabase/types'

type Store = Database['public']['Tables']['stores']['Row']
type StoreInsert = Database['public']['Tables']['stores']['Insert']
type StoreUpdate = Database['public']['Tables']['stores']['Update']

export const useStores = (filters?: StoreFilters) => {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStores()
  }, [filters?.isActive])

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await storesService.getAll(filters)
      setStores(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar lojas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createStore = async (store: StoreInsert) => {
    try {
      setLoading(true)
      setError(null)
      const newStore = await storesService.create(store)
      setStores(prev => [...prev, newStore])
      return newStore
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar loja'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateStore = async (id: string, updates: StoreUpdate) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await storesService.update(id, updates)
      setStores(prev => prev.map(s => s.id === id ? updated : s))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar loja'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteStore = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await storesService.delete(id)
      setStores(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar loja'
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
      const updated = await storesService.toggleActive(id, isActive)
      setStores(prev => prev.map(s => s.id === id ? updated : s))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const generateCode = async () => {
    try {
      return await storesService.generateCode()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar código'
      setError(errorMessage)
      throw err
    }
  }

  const getStoreWithUser = async (id: string): Promise<StoreWithUser> => {
    try {
      setLoading(true)
      setError(null)
      return await storesService.getWithUser(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar loja'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchStores()
  }

  return {
    stores,
    loading,
    error,
    createStore,
    updateStore,
    deleteStore,
    toggleActive,
    generateCode,
    getStoreWithUser,
    refresh,
  }
}