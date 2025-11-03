import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Store = Database['public']['Tables']['stores']['Row']
type StoreInsert = Database['public']['Tables']['stores']['Insert']
type StoreUpdate = Database['public']['Tables']['stores']['Update']

export interface StoreFilters {
  isActive?: boolean
  searchTerm?: string
}

export interface StoreWithUser extends Store {
  user_id?: string
  user_email?: string
}

export const storesService = {
  async getAll(filters?: StoreFilters) {
    let query = supabase
      .from('stores')
      .select('*')
      .order('name', { ascending: true })

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    if (filters?.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data as Store[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Store
  },

  async getWithUser(id: string): Promise<StoreWithUser> {
    const store = await this.getById(id)

    const { data: userData } = await supabase
      .from('users_metadata')
      .select('id, full_name')
      .eq('store_id', id)
      .eq('role', 'loja')
      .single()

    if (userData) {
      const { data: authUser } = await supabase.auth.admin.getUserById(userData.id)
      
      return {
        ...store,
        user_id: userData.id,
        user_email: authUser.user?.email,
      }
    }

    return store
  },

  async create(store: StoreInsert) {
    const { data, error } = await supabase
      .from('stores')
      .insert(store)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Store
  },

  async update(id: string, updates: StoreUpdate) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Store
  },

  async delete(id: string) {
    const { data: userData } = await supabase
      .from('users_metadata')
      .select('id')
      .eq('store_id', id)
      .eq('role', 'loja')
      .single()

    if (userData) {
      await supabase.auth.admin.deleteUser(userData.id)
    }

    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  },

  async toggleActive(id: string, isActive: boolean) {
    return await this.update(id, { is_active: isActive })
  },

  async generateCode() {
    const { data: stores } = await supabase
      .from('stores')
      .select('code')
      .order('code', { ascending: false })
      .limit(1)

    if (!stores || stores.length === 0) {
      return 'DL001'
    }

    const lastCode = stores[0].code
    const number = parseInt(lastCode.replace(/\D/g, ''), 10)
    const nextNumber = (number + 1).toString().padStart(3, '0')
    
    return `DL${nextNumber}`
  },

  async checkEmailExists(email: string, excludeId?: string) {
    let query = supabase
      .from('stores')
      .select('id')
      .eq('email', email)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()

    return !!data
  },

  async checkCodeExists(code: string, excludeId?: string) {
    let query = supabase
      .from('stores')
      .select('id')
      .eq('code', code)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()

    return !!data
  },
}