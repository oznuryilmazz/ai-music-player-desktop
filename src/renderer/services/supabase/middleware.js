import { NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // Always use supabase.auth.getUser() to protect pages and user data.
  // Never trust supabase.auth.getSession() inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.

  // refreshing the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}
