import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Promotion = Database['public']['Tables']['promotions']['Row']
type PromotionInsert = Database['public']['Tables']['promotions']['Insert']
type PromotionUpdate = Database['public']['Tables']['promotions']['Update']

export interface PromotionFilters {
  storeId?: string
  isActive?: boolean
  isVisible?: boolean
}

export const promotionsService = {
  async getAll(filters?: PromotionFilters) {
    let query = supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.storeId) {
      query = query.eq('store_id', filters.storeId)
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    if (filters?.isVisible !== undefined) {
      query = query.eq('is_visible', filters.isVisible)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data as Promotion[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Promotion
  },

  async create(promotion: PromotionInsert) {
    const { data, error } = await supabase
      .from('promotions')
      .insert(promotion)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Promotion
  },

  async update(id: string, updates: PromotionUpdate) {
    const { data, error } = await supabase
      .from('promotions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Promotion
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  },

  async toggleVisibility(id: string, isVisible: boolean) {
    return await this.update(id, { is_visible: isVisible })
  },

  async toggleActive(id: string, isActive: boolean) {
    return await this.update(id, { is_active: isActive })
  },
}