import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

export function useAdminCheck() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        } else {
          setIsAdmin(!!data)
        }
      } catch (err) {
        console.error('Error checking admin:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkAdmin()
    }
  }, [user, authLoading])

  return { isAdmin, loading: loading || authLoading, user }
}
