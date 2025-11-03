import { supabase } from '@/lib/supabase/client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  role: string
  storeId: string | null
  fullName: string
}

export interface CreateStoreUserData {
  email: string
  password: string
  fullName: string
  storeId: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Falha na autenticação')
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    const { data: metadata, error: metadataError } = await supabase
      .from('users_metadata')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (metadataError || !metadata) {
      throw new Error('Erro ao carregar dados do usuário')
    }

    return {
      id: authData.user.id,
      email: authData.user.email!,
      role: metadata.role,
      storeId: metadata.store_id,
      fullName: metadata.full_name,
    }
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: metadata } = await supabase
      .from('users_metadata')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!metadata) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      role: metadata.role,
      storeId: metadata.store_id,
      fullName: metadata.full_name,
    }
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  async createStoreUser(userData: CreateStoreUserData) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    })

    if (authError) {
      throw new Error(`Erro ao criar usuário: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Falha ao criar usuário')
    }

    const { error: metadataError } = await supabase
      .from('users_metadata')
      .insert({
        id: authData.user.id,
        role: 'loja',
        store_id: userData.storeId,
        full_name: userData.fullName,
      })

    if (metadataError) {
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw new Error(`Erro ao criar metadata: ${metadataError.message}`)
    }

    return {
      userId: authData.user.id,
      email: authData.user.email!,
    }
  },

  async deleteStoreUser(userId: string) {
    const { error: metadataError } = await supabase
      .from('users_metadata')
      .delete()
      .eq('id', userId)

    if (metadataError) {
      throw new Error(`Erro ao deletar metadata: ${metadataError.message}`)
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      throw new Error(`Erro ao deletar usuário: ${authError.message}`)
    }
  },

  async updateStoreUser(userId: string, updates: { email?: string; password?: string; fullName?: string }) {
    const authUpdates: { email?: string; password?: string } = {}
    
    if (updates.email) {
      authUpdates.email = updates.email
    }
    
    if (updates.password) {
      authUpdates.password = updates.password
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        authUpdates
      )

      if (authError) {
        throw new Error(`Erro ao atualizar usuário: ${authError.message}`)
      }
    }

    if (updates.fullName) {
      const { error: metadataError } = await supabase
        .from('users_metadata')
        .update({ full_name: updates.fullName })
        .eq('id', userId)

      if (metadataError) {
        throw new Error(`Erro ao atualizar metadata: ${metadataError.message}`)
      }
    }
  },
}