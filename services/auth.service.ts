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

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (authError) {
      console.error('🔴 Erro de autenticação:', authError)
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Falha na autenticação')
    }

    console.log('✅ Auth bem-sucedida, buscando metadata...')

    await new Promise(resolve => setTimeout(resolve, 500))

    const { data: metadata, error: metadataError } = await supabase
      .from('users_metadata')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (metadataError || !metadata) {
      console.error('🔴 Erro ao buscar metadata:', metadataError)
      throw new Error('Erro ao carregar dados do usuário')
    }

    console.log('✅ Metadata carregada:', metadata)

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
}