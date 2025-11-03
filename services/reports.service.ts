import { supabase } from '@/lib/supabase/client'
import { getDaysUntilExpiration, getExpirationCategory } from '@/utils/dateHelpers'
import { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']

export interface ReportFilters {
  storeId?: string
  startDate?: string
  endDate?: string
}

export interface ExpirationData {
  category: string
  count: number
  percentage: number
}

export interface SalesData {
  date: string
  sales: number
  revenue: number
}

export interface CategoryData {
  category: string
  value: number
}

export type TrendType = 'up' | 'down' | 'neutral'

export interface MetricData {
  label: string
  value: number | string
  change?: number
  trend?: TrendType
}

export const reportsService = {
  async getExpirationReport(filters?: ReportFilters): Promise<ExpirationData[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_sold', false)

    if (filters?.storeId) {
      query = query.eq('store_id', filters.storeId)
    }

    const { data: products, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    if (!products) {
      return []
    }

    const categories: Record<string, number> = {
      declarar: 0,
      emergencia: 0,
      urgente: 0,
      'pouco-urgente': 0,
      analise: 0,
    }

    products.forEach((product: Product) => {
      const category = getExpirationCategory(product.expiration_date)
      if (category in categories) {
        categories[category]++
      }
    })

    const total = products.length
    const categoryLabels: Record<string, string> = {
      declarar: 'Declarar Baixa',
      emergencia: 'Emergência',
      urgente: 'Urgente',
      'pouco-urgente': 'Pouco Urgente',
      analise: 'Em Análise',
    }

    return Object.entries(categories).map(([key, count]) => ({
      category: categoryLabels[key],
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
  },

  async getSalesTrend(filters?: ReportFilters): Promise<SalesData[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_sold', true)
      .not('sold_at', 'is', null)

    if (filters?.storeId) {
      query = query.eq('store_id', filters.storeId)
    }

    if (filters?.startDate) {
      query = query.gte('sold_at', filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte('sold_at', filters.endDate)
    }

    const { data: products, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    if (!products) {
      return []
    }

    const salesByDate: Record<string, { sales: number; revenue: number }> = {}

    products.forEach((product: Product) => {
      if (!product.sold_at) return
      
      const date = new Date(product.sold_at).toISOString().split('T')[0]
      
      if (!salesByDate[date]) {
        salesByDate[date] = { sales: 0, revenue: 0 }
      }
      
      salesByDate[date].sales++
      salesByDate[date].revenue += Number(product.current_price)
    })

    return Object.entries(salesByDate)
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  },

  async getTopCategories(filters?: ReportFilters): Promise<CategoryData[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_sold', true)

    if (filters?.storeId) {
      query = query.eq('store_id', filters.storeId)
    }

    if (filters?.startDate && filters?.endDate) {
      query = query
        .gte('sold_at', filters.startDate)
        .lte('sold_at', filters.endDate)
    }

    const { data: products, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    if (!products) {
      return []
    }

    const categoryCounts: Record<string, number> = {}

    products.forEach((product: Product) => {
      const category = product.category
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    return Object.entries(categoryCounts)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  },

  async getMetrics(filters?: ReportFilters): Promise<MetricData[]> {
    let productsQuery = supabase
      .from('products')
      .select('*')
      .eq('is_sold', false)

    let soldQuery = supabase
      .from('products')
      .select('*')
      .eq('is_sold', true)

    if (filters?.storeId) {
      productsQuery = productsQuery.eq('store_id', filters.storeId)
      soldQuery = soldQuery.eq('store_id', filters.storeId)
    }

    if (filters?.startDate && filters?.endDate) {
      soldQuery = soldQuery
        .gte('sold_at', filters.startDate)
        .lte('sold_at', filters.endDate)
    }

    const [productsResult, soldResult] = await Promise.all([
      productsQuery,
      soldQuery,
    ])

    if (productsResult.error) {
      throw new Error(productsResult.error.message)
    }

    if (soldResult.error) {
      throw new Error(soldResult.error.message)
    }

    const products = productsResult.data || []
    const soldProducts = soldResult.data || []

    const totalStock = products.length
    const totalSold = soldProducts.length
    
    const totalRevenue = soldProducts.reduce((sum: number, p: Product) => {
      return sum + Number(p.current_price)
    }, 0)
    
    const stockValue = products.reduce((sum: number, p: Product) => {
      return sum + (Number(p.current_price) * p.quantity)
    }, 0)

    const nearExpiration = products.filter((p: Product) => {
      const category = getExpirationCategory(p.expiration_date)
      return category === 'declarar' || category === 'emergencia'
    }).length

    const averageTicket = soldProducts.length > 0 
      ? totalRevenue / soldProducts.length 
      : 0

    const metrics: MetricData[] = [
      {
        label: 'Produtos em Estoque',
        value: totalStock,
        trend: 'neutral',
      },
      {
        label: 'Produtos Vendidos',
        value: totalSold,
        trend: totalSold > 0 ? 'up' : 'neutral',
      },
      {
        label: 'Receita Total',
        value: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
        }).format(totalRevenue),
        trend: totalRevenue > 0 ? 'up' : 'neutral',
      },
      {
        label: 'Valor em Estoque',
        value: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
        }).format(stockValue),
        trend: 'neutral',
      },
      {
        label: 'Produtos em Alerta',
        value: nearExpiration,
        trend: nearExpiration > 10 ? 'down' : 'neutral',
      },
      {
        label: 'Ticket Médio',
        value: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(averageTicket),
        trend: 'neutral',
      },
    ]

    return metrics
  },
}