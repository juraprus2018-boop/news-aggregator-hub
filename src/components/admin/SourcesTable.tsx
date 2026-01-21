import { useState } from 'react'
import { Pencil, Trash2, Plus, ExternalLink, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSources, useDeleteSource } from '@/hooks/useSources'
import { useToast } from '@/hooks/use-toast'
import { SourceDialog } from './SourceDialog'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Tables } from '@/integrations/supabase/types'

type Source = Tables<'sources'>

export function SourcesTable() {
  const { data: sources, isLoading, refetch } = useSources()
  const deleteSource = useDeleteSource()
  const { toast } = useToast()
  const [editSource, setEditSource] = useState<Source | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      await deleteSource.mutateAsync(deleteId)
      toast({ title: 'Bron verwijderd' })
    } catch (error: any) {
      toast({
        title: 'Fout bij verwijderen',
        description: error.message,
        variant: 'destructive'
      })
    }
    setDeleteId(null)
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Bronnen laden...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Nieuwsbronnen</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Verversen
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Bron toevoegen
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Laatst gecrawld</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources?.map((source) => (
              <TableRow key={source.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{source.name}</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{source.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={source.is_active ? 'default' : 'outline'}>
                    {source.is_active ? 'Actief' : 'Inactief'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {source.last_crawled_at
                    ? formatDistanceToNow(new Date(source.last_crawled_at), {
                        addSuffix: true,
                        locale: nl
                      })
                    : 'Nog niet gecrawld'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditSource(source)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(source.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sources?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Geen bronnen gevonden. Voeg een nieuwe bron toe.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SourceDialog
        source={editSource}
        open={!!editSource || showCreate}
        onClose={() => {
          setEditSource(null)
          setShowCreate(false)
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bron verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dit verwijdert de bron permanent. Bestaande artikelen blijven bewaard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
