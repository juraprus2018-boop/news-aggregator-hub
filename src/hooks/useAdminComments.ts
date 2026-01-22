import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface AdminComment {
  id: string
  article_id: string
  parent_id: string | null
  author_name: string
  author_email: string
  content: string
  created_at: string
  is_approved: boolean
  article?: {
    title: string
    slug: string
  }
}

export function useAdminComments() {
  return useQuery({
    queryKey: ['admin-comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          article:articles(title, slug)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as AdminComment[]
    },
  })
}

export function useUpdateCommentApproval() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
