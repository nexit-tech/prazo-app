import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  console.log('🔒 Middleware - Path:', request.nextUrl.pathname)
  console.log('👤 Middleware - User:', user?.email)

  const isAuthPage = request.nextUrl.pathname === '/login'
  const isGestorRoute = request.nextUrl.pathname.startsWith('/gestor')
  const isLojaRoute = request.nextUrl.pathname.startsWith('/loja')

  if (!user && (isGestorRoute || isLojaRoute)) {
    console.log('⛔ Redirecionando para login - sem usuário')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthPage) {
    const { data: metadata } = await supabase
      .from('users_metadata')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('✅ Usuário logado - Role:', metadata?.role)

    if (metadata?.role === 'gestor') {
      console.log('🔀 Redirecionando para /gestor/dashboard')
      return NextResponse.redirect(new URL('/gestor/dashboard', request.url))
    } else {
      console.log('🔀 Redirecionando para /loja/dashboard')
      return NextResponse.redirect(new URL('/loja/dashboard', request.url))
    }
  }

  if (user && isGestorRoute) {
    const { data: metadata } = await supabase
      .from('users_metadata')
      .select('role')
      .eq('id', user.id)
      .single()

    if (metadata?.role !== 'gestor') {
      console.log('⛔ Acesso negado - não é gestor')
      return NextResponse.redirect(new URL('/loja/dashboard', request.url))
    }
  }

  if (user && isLojaRoute) {
    const { data: metadata } = await supabase
      .from('users_metadata')
      .select('role')
      .eq('id', user.id)
      .single()

    if (metadata?.role !== 'loja') {
      console.log('⛔ Acesso negado - não é loja')
      return NextResponse.redirect(new URL('/gestor/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}