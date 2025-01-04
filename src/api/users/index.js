// api.js

import { supabase } from '../../renderer/services/supabase/client'
import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js'

export async function listUser() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, sectors(*), parent:parent_id(name)')

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    return { error: 'Error fetching user: ' + error.message }
  }
}

export async function createUser(tempUser) {
  try {
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: {
        ...tempUser
      }
    })

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json()
        console.log(errorMessage)
        return errorMessage
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error:' + error.message)
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error:' + error.message)
      }
    }

    return { success: true, data }
  } catch (error) {
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json()
      return { error: 'Function returned an error: ' + errorMessage }
    } else if (error instanceof FunctionsRelayError) {
      return { error: 'Relay error: ' + error.message }
    } else if (error instanceof FunctionsFetchError) {
      return { error: 'Fetch error: ' + error.message }
    } else {
      return { error: 'Unexpected error: ' + error.message }
    }
  }
}

export async function updateUser(id, tempUser) {
  try {
    const { data, error } = await supabase.functions.invoke('update-user', {
      body: {
        ...tempUser,
        id
      }
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json()
      return { error: 'Function returned an error: ' + errorMessage }
    } else if (error instanceof FunctionsRelayError) {
      return { error: 'Relay error: ' + error.message }
    } else if (error instanceof FunctionsFetchError) {
      return { error: 'Fetch error: ' + error.message }
    } else {
      return { error: 'Unexpected error: ' + error.message }
    }
  }
}

export async function deleteUser(id) {
  try {
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { id }
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    return { error: 'Error deleting user: ' + error.message }
  }
}

export async function getUser(id) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, sectors(*), parent:parent_id(name), preferences(*) ')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    return { error: 'Error fetching user: ' + error.message }
  }
}

export async function getCompany(id) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, sectors(*), parent:parent_id(name)')
      .eq('parent_id', id)

    if (error) {
      throw error
    }

    return { data }
  } catch (error) {
    return { error: 'Error fetching user: ' + error.message }
  }
}

export const getBranchsCount = async () => {
  let result = null

  try {
    const { count, error, status } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'branch')

    console.log('status', status)

    if (status == 401) {
      await supabase.auth.signOut()

      return { status: 'Unauthorized' }
    }

    if (error) {
      throw new Error(error.message)
    } else {
      result = count
    }
  } catch (err) {
    result = { error: err.message }
  }
  return result
}

export const changeUserPrefences = async (id, prefences) => {
  try {
    const { data, error } = await supabase.rpc('update_user_preferences', {
      p_user_id: id,
      p_mute_during_adhan: prefences.prayerTime,
      p_override_playlists_on_weather_condition: prefences.weatherPlaylist,
      p_override_playlists_on_special_days: prefences.specialEventPlaylist,
      p_notify_for_special_occasions: prefences.specialEventAnnouncements
    })

    if (error) throw new Error(error.message)

    return { success: true, data }
  } catch (err) {
    return { error: err.message }
  }
}
