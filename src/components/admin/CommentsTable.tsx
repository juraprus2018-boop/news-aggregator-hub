import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Check, X, Trash2, Eye, EyeOff, ExternalLink, MessageCircle, AlertTriangle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminComments, useUpdateCommentApproval, useDeleteComment } from '@/hooks/useAdminComments'
import { toast } from 'sonner'

export function CommentsTable() {
  const { data: comments, isLoading } = useAdminComments()
  const updateApproval = useUpdateCommentApproval()
  const deleteComment = useDeleteComment()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      await updateApproval.mutateAsync({ id, is_approved: approve })
      toast.success(approve ? 'Reactie goedgekeurd' : 'Reactie verborgen')
    } catch (error) {
      toast.error('Kon reactie niet bijwerken')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComment.mutateAsync(id)
      toast.success('Reactie verwijderd')
    } catch (error) {
      toast.error('Kon reactie niet verwijderen')
    }
  }

  const filteredComments = comments?.filter((comment) => {
    if (filter === 'pending') return !comment.is_approved
    if (filter === 'approved') return comment.is_approved
    return true
  })

  const pendingCount = comments?.filter((c) => !c.is_approved).length || 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reacties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Reacties
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount} wachtend
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Beheer en modereer reacties van bezoekers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Alle ({comments?.length || 0})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Wachtend ({pendingCount})
            </Button>
            <Button
              variant={filter === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('approved')}
            >
              Goedgekeurd ({(comments?.length || 0) - pendingCount})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredComments && filteredComments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead className="max-w-[300px]">Reactie</TableHead>
                <TableHead>Artikel</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    {comment.is_approved ? (
                      <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                        <Eye className="w-3 h-3" />
                        Zichtbaar
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600">
                        <EyeOff className="w-3 h-3" />
                        Verborgen
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{comment.author_name}</p>
                      <p className="text-xs text-muted-foreground">{comment.author_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm line-clamp-2">{comment.content}</p>
                    {comment.parent_id && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Antwoord
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {comment.article ? (
                      <Link
                        to={`/artikel/${comment.article.slug}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1 max-w-[150px]"
                      >
                        <span className="truncate">{comment.article.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: nl,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {comment.is_approved ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(comment.id, false)}
                          title="Verbergen"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(comment.id, true)}
                          title="Goedkeuren"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              Reactie verwijderen?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je deze reactie wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                              {comment.parent_id === null && (
                                <span className="block mt-2 font-medium text-foreground">
                                  Let op: Alle antwoorden op deze reactie worden ook verwijderd.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(comment.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Verwijderen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Geen reacties gevonden</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
