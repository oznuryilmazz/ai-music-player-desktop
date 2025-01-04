import { supabase } from '../../renderer/services/supabase/client'

export async function signIn(formData) {
  const email = formData.email
  const password = formData.password

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return { success: false }
  }

  return { success: true, data }
}
