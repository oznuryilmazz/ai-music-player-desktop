import { createContext, useContext, useEffect, useState } from 'react'

import { createClient } from '../../services/supabase/client'
import { getUser } from '../../../api/users'
import { useNavigate } from 'react-router-dom'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const supabase = createClient()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await getUser(user.id)
        setUser(data)
      } else {
        navigate('/login')
      }
    }

    fetchUser()
  }, [])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
