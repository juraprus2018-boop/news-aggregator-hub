import { RefreshCw, CheckCircle, XCircle } from 'lucide-react'
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
import { useCrawlLogs } from '@/hooks/useCrawlLogs'
import { formatDistanceToNow, format } from 'date-fns'
import { nl } from 'date-fns/locale'

export function CrawlLogsTable() {
  const { data: logs, isLoading, refetch } = useCrawlLogs()

  if (isLoading) {
    return <div className="text-muted-foreground">Logs laden...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Crawl Logs</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Verversen
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Bron</TableHead>
              <TableHead>Gevonden</TableHead>
              <TableHead>Toegevoegd</TableHead>
              <TableHead>Tijd</TableHead>
              <TableHead>Foutmelding</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {log.status === 'success' ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {log.sources?.name || 'Onbekend'}
                </TableCell>
                <TableCell>{log.articles_found ?? 0}</TableCell>
                <TableCell>{log.articles_added ?? 0}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  <span title={format(new Date(log.created_at), 'PPpp', { locale: nl })}>
                    {formatDistanceToNow(new Date(log.created_at), {
                      addSuffix: true,
                      locale: nl
                    })}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-destructive">
                  {log.error_message || '-'}
                </TableCell>
              </TableRow>
            ))}
            {logs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Geen crawl logs gevonden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
