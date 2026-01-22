import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageCircle, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useCreateComment } from '@/hooks/useComments'
import { toast } from 'sonner'

const commentSchema = z.object({
  author_name: z
    .string()
    .trim()
    .min(2, 'Naam moet minimaal 2 karakters zijn')
    .max(50, 'Naam mag maximaal 50 karakters zijn'),
  author_email: z
    .string()
    .trim()
    .email('Ongeldig e-mailadres')
    .max(100, 'E-mail mag maximaal 100 karakters zijn'),
  content: z
    .string()
    .trim()
    .min(3, 'Reactie moet minimaal 3 karakters zijn')
    .max(2000, 'Reactie mag maximaal 2000 karakters zijn'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  articleId: string
  parentId?: string | null
  parentAuthor?: string
  onCancel?: () => void
  onSuccess?: () => void
}

export function CommentForm({
  articleId,
  parentId = null,
  parentAuthor,
  onCancel,
  onSuccess,
}: CommentFormProps) {
  const createComment = useCreateComment()
  const [isExpanded, setIsExpanded] = useState(!!parentId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const onSubmit = async (data: CommentFormData) => {
    try {
      await createComment.mutateAsync({
        article_id: articleId,
        parent_id: parentId,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
      })
      reset()
      setIsExpanded(false)
      toast.success('Reactie geplaatst!')
      onSuccess?.()
    } catch (error) {
      toast.error('Kon reactie niet plaatsen. Probeer het opnieuw.')
    }
  }

  if (!isExpanded && !parentId) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsExpanded(true)}
        className="gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Plaats een reactie
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-muted/30 rounded-lg p-4 border border-border"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">
          {parentId ? (
            <>
              Reageer op <span className="text-primary">{parentAuthor}</span>
            </>
          ) : (
            'Plaats een reactie'
          )}
        </h4>
        {(onCancel || !parentId) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onCancel?.()
              if (!parentId) setIsExpanded(false)
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author_name">Naam *</Label>
          <Input
            id="author_name"
            placeholder="Je naam"
            {...register('author_name')}
            aria-invalid={!!errors.author_name}
          />
          {errors.author_name && (
            <p className="text-xs text-destructive">{errors.author_name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="author_email">E-mail *</Label>
          <Input
            id="author_email"
            type="email"
            placeholder="je@email.nl"
            {...register('author_email')}
            aria-invalid={!!errors.author_email}
          />
          {errors.author_email && (
            <p className="text-xs text-destructive">{errors.author_email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Reactie *</Label>
        <Textarea
          id="content"
          placeholder="Schrijf je reactie..."
          rows={4}
          {...register('content')}
          aria-invalid={!!errors.content}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          * Je e-mail wordt niet gepubliceerd
        </p>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Verzenden...' : 'Verstuur'}
        </Button>
      </div>
    </form>
  )
}
