import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import { MessageCircle, Reply, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CommentForm } from './CommentForm'
import { useComments, type Comment } from '@/hooks/useComments'

interface CommentItemProps {
  comment: Comment
  articleId: string
  depth?: number
}

function CommentItem({ comment, articleId, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const maxDepth = 3 // Maximum nesting level

  return (
    <div className={`${depth > 0 ? 'ml-4 sm:ml-8 border-l-2 border-border pl-4' : ''}`}>
      <div className="py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{comment.author_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: nl,
                })}
              </span>
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 -ml-2 text-muted-foreground hover:text-foreground gap-1.5"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="w-3.5 h-3.5" />
                Reageer
              </Button>
            )}
          </div>
        </div>

        {showReplyForm && (
          <div className="mt-4 ml-11">
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              parentAuthor={comment.author_name}
              onCancel={() => setShowReplyForm(false)}
              onSuccess={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentListProps {
  articleId: string
}

export function CommentList({ articleId }: CommentListProps) {
  const { data: comments, isLoading } = useComments(articleId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const totalComments = comments?.reduce((acc, comment) => {
    const countReplies = (c: Comment): number => {
      return 1 + (c.replies?.reduce((sum, r) => sum + countReplies(r), 0) || 0)
    }
    return acc + countReplies(comment)
  }, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-bold">
          Reacties {totalComments > 0 && `(${totalComments})`}
        </h3>
      </div>

      <CommentForm articleId={articleId} />

      {comments && comments.length > 0 ? (
        <div className="divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-8 text-center">
          Nog geen reacties. Wees de eerste om te reageren!
        </p>
      )}
    </div>
  )
}
