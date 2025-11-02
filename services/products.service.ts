import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export interface ProductFilters {
  storeId?: string
  category?: string
  isExpiring?: boolean
  isSold?: boolean
  searchTerm?: string
}

export const productsService = {
  async getAll(filters?: ProductFilters) {
    let query = supabase
      .from('products')
      .select('*')
      .order('expiration_date', { ascending: true })

    if (filters?.storeId) {
      query = query.eq('store_id', filters.storeId)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.isSold !== undefined) {
      query = query.eq('is_sold', filters.isSold)
    }

    if (filters?.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,barcode.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data as Product[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Product
  },

  async create(product: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Product
  },

  async update(id: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Product
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  },

  async markAsSold(id: string) {
    return await this.update(id, {
      is_sold: true,
      sold_at: new Date().toISOString(),
    })
  },

  async getExpiringProducts(storeId?: string, daysThreshold = 30) {
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_sold', false)
      .lte('expiration_date', thresholdDate.toISOString().split('T')[0])
      .order('expiration_date', { ascending: true })

    if (storeId) {
      query = query.eq('store_id', storeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data as Product[]
  },
}