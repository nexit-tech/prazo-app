'use client'

import { useState, useEffect } from 'react'
import { productsService, ProductFilters } from '@/services/products.service'
import { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export const useProducts = (filters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [filters?.storeId, filters?.category, filters?.isSold])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll(filters)
      setProducts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (product: ProductInsert) => {
    try {
      setLoading(true)
      setError(null)
      const newProduct = await productsService.create(product)
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await productsService.update(id, updates)
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await productsService.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const markAsSold = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const updated = await productsService.markAsSold(id)
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar como vendido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => {
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    markAsSold,
    refresh,
  }
}