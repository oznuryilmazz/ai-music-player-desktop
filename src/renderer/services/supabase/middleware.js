import { supabase } from './client'

export const verifyUser = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).send('Authorization token missing')
  }

  const { data: user, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).send('Unauthorized')
  }

  req.user = user
  next()
}
