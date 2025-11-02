'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DebugLogin() {
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    console.log('🔍 Testando conexão...')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'luana@drogaslider.com.br',
        password: 'Luana123456',
      })

      console.log('📊 Resposta completa:', { data, error })

      if (error) {
        setResult({ type: 'error', message: error.message, details: error })
      } else {
        setResult({ type: 'success', data })
      }
    } catch (err) {
      console.error('❌ Erro capturado:', err)
      setResult({ type: 'catch', error: err })
    }
  }

  const testEnv = () => {
    console.log('🔑 Variáveis de ambiente:')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Debug Login</h1>
      <button onClick={testEnv} style={{ margin: '1rem', padding: '1rem' }}>
        Testar ENV
      </button>
      <button onClick={testConnection} style={{ margin: '1rem', padding: '1rem' }}>
        Testar Login
      </button>
      
      {result && (
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}