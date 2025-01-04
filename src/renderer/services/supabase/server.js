// src/lib/server.js
import { createClient } from '@supabase/supabase-js'

// Supabase URL ve Servis Role Key (Environment Variables kullanın)
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

// Sunucu tarafı Supabase istemcisini oluşturun
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
