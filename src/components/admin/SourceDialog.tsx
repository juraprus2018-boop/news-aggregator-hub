import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateSource, useUpdateSource } from '@/hooks/useSources'
import { useToast } from '@/hooks/use-toast'
import type { Tables } from '@/integrations/supabase/types'

type Source = Tables<'sources'>

const formSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  url: z.string().url('Ongeldige URL'),
  rss_url: z.string().url('Ongeldige RSS URL'),
  category: z.string().min(1, 'Categorie is verplicht'),
  is_active: z.boolean()
})

type FormValues = z.infer<typeof formSchema>

interface SourceDialogProps {
  source: Source | null
  open: boolean
  onClose: () => void
}

export function SourceDialog({ source, open, onClose }: SourceDialogProps) {
  const createSource = useCreateSource()
  const updateSource = useUpdateSource()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      rss_url: '',
      category: 'algemeen',
      is_active: true
    }
  })

  useEffect(() => {
    if (source) {
      form.reset({
        name: source.name,
        url: source.url,
        rss_url: source.rss_url,
        category: source.category,
        is_active: source.is_active
      })
    } else {
      form.reset({
        name: '',
        url: '',
        rss_url: '',
        category: 'algemeen',
        is_active: true
      })
    }
  }, [source, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (source) {
        await updateSource.mutateAsync({ id: source.id, ...values })
        toast({ title: 'Bron bijgewerkt' })
      } else {
        await createSource.mutateAsync({
          name: values.name,
          url: values.url,
          rss_url: values.rss_url,
          category: values.category,
          is_active: values.is_active
        })
        toast({ title: 'Bron toegevoegd' })
      }
      onClose()
    } catch (error: any) {
      toast({
        title: 'Fout',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {source ? 'Bron bewerken' : 'Nieuwe bron toevoegen'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam</FormLabel>
                  <FormControl>
                    <Input placeholder="NOS Nieuws" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://nos.nl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rss_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RSS Feed URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://feeds.nos.nl/nosnieuwsalgemeen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorie</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer categorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="algemeen">Algemeen</SelectItem>
                      <SelectItem value="nederland">Nederland</SelectItem>
                      <SelectItem value="internationaal">Internationaal</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Actief</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Schakel in om artikelen van deze bron te crawlen
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuleren
              </Button>
              <Button type="submit" disabled={createSource.isPending || updateSource.isPending}>
                {source ? 'Opslaan' : 'Toevoegen'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
