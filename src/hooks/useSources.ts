import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

type Source = Tables<'sources'>
type SourceInsert = TablesInsert<'sources'>
type SourceUpdate = TablesUpdate<'sources'>

export function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as Source[]
    }
  })
}

export function useCreateSource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (source: SourceInsert) => {
      const { data, error } = await supabase
        .from('sources')
        .insert(source)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    }
  })
}

export function useUpdateSource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: SourceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    }
  })
}

export function useDeleteSource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] })
    }
  })
}
