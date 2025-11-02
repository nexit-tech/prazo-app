export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          code: string
          name: string
          email: string
          address: string
          phone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          email: string
          address: string
          phone: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          email?: string
          address?: string
          phone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          category: string
          brand: string
          barcode: string
          internal_code: string
          quantity: number
          expiration_date: string
          batch: string
          original_price: number
          current_price: number
          store_id: string
          is_sold: boolean
          sold_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          brand: string
          barcode: string
          internal_code: string
          quantity: number
          expiration_date: string
          batch: string
          original_price: number
          current_price: number
          store_id: string
          is_sold?: boolean
          sold_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          brand?: string
          barcode?: string
          internal_code?: string
          quantity?: number
          expiration_date?: string
          batch?: string
          original_price?: number
          current_price?: number
          store_id?: string
          is_sold?: boolean
          sold_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      promotions: {
        Row: {
          id: string
          product_id: string
          store_id: string
          discount: number
          new_price: number
          new_barcode: string
          new_internal_code: string
          start_date: string
          end_date: string
          is_visible: boolean
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          store_id: string
          discount: number
          new_price: number
          new_barcode: string
          new_internal_code: string
          start_date: string
          end_date: string
          is_visible?: boolean
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          store_id?: string
          discount?: number
          new_price?: number
          new_barcode?: string
          new_internal_code?: string
          start_date?: string
          end_date?: string
          is_visible?: boolean
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      transfers: {
        Row: {
          id: string
          product_id: string
          from_store_id: string
          to_store_id: string
          quantity: number
          status: string
          requested_at: string
          requested_by: string
          approved_at: string | null
          approved_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          from_store_id: string
          to_store_id: string
          quantity: number
          status: string
          requested_at?: string
          requested_by: string
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          from_store_id?: string
          to_store_id?: string
          quantity?: number
          status?: string
          requested_at?: string
          requested_by?: string
          approved_at?: string | null
          approved_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users_metadata: {
        Row: {
          id: string
          role: string
          store_id: string | null
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: string
          store_id?: string | null
          full_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          store_id?: string | null
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}