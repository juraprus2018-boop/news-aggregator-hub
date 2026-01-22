import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Comment {
  id: string
  article_id: string
  parent_id: string | null
  author_name: string
  author_email: string
  content: string
  created_at: string
  is_approved: boolean
  replies?: Comment[]
}

export interface CreateCommentInput {
  article_id: string
  parent_id?: string | null
  author_name: string
  author_email: string
  content: string
}

export function useComments(articleId: string) {
  return useQuery({
    queryKey: ['comments', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Organize into nested structure
      const commentsMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      // First pass: create map of all comments
      data.forEach((comment) => {
        commentsMap.set(comment.id, { ...comment, replies: [] })
      })

      // Second pass: organize into tree structure
      data.forEach((comment) => {
        const commentWithReplies = commentsMap.get(comment.id)!
        if (comment.parent_id && commentsMap.has(comment.parent_id)) {
          commentsMap.get(comment.parent_id)!.replies!.push(commentWithReplies)
        } else {
          rootComments.push(commentWithReplies)
        }
      })

      return rootComments
    },
    enabled: !!articleId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          article_id: input.article_id,
          parent_id: input.parent_id || null,
          author_name: input.author_name.trim(),
          author_email: input.author_email.trim().toLowerCase(),
          content: input.content.trim(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.article_id] })
    },
  })
}
