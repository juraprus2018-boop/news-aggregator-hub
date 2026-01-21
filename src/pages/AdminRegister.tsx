import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, UserPlus, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useAdminCheck } from '@/hooks/useAdminCheck'
import { useAdminExists } from '@/hooks/useAdminExists'
import { supabase } from '@/integrations/supabase/client'

export default function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const { isAdmin, loading: adminLoading, user } = useAdminCheck()
  const { data: adminExists, isLoading: checkingAdmins } = useAdminExists()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!adminLoading && user && isAdmin) {
      navigate('/admin')
    }
  }, [adminLoading, user, isAdmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: 'Wachtwoorden komen niet overeen',
        variant: 'destructive'
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'Wachtwoord te kort',
        description: 'Wachtwoord moet minimaal 6 tekens zijn',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    // First sign up the user
    const { error: signUpError } = await signUp(email, password)

    if (signUpError) {
      toast({
        title: 'Registratie mislukt',
        description: signUpError.message,
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    // Wait for session to be established
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      toast({
        title: 'Registratie gelukt!',
        description: 'Je account is aangemaakt. Log nu in om door te gaan.',
      })
      navigate('/admin/login')
      setIsLoading(false)
      return
    }

    // Add as admin
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: session.user.id,
        email: email
      })

    if (adminError) {
      toast({
        title: 'Admin registratie mislukt',
        description: adminError.message,
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    toast({
      title: 'Admin account aangemaakt!',
      description: 'Je bent nu ingelogd als administrator.'
    })
    
    navigate('/admin')
    setIsLoading(false)
  }

  if (checkingAdmins || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    )
  }

  // If admins already exist, show message
  if (adminExists) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted text-muted-foreground">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Registratie gesloten</CardTitle>
            <CardDescription>
              Er is al een administrator geconfigureerd
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Geen nieuwe registraties mogelijk</AlertTitle>
              <AlertDescription>
                Neem contact op met de bestaande administrator om toegang te krijgen tot het admin dashboard.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <Button variant="default" onClick={() => navigate('/admin/login')}>
                Inloggen
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Terug naar nieuws
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
              <Newspaper className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Eerste Admin Registratie</CardTitle>
          <CardDescription>
            Maak het eerste administrator account aan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Setup modus</AlertTitle>
            <AlertDescription>
              Er zijn nog geen administrators. Je wordt automatisch admin na registratie.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimaal 6 tekens"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Herhaal wachtwoord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoading ? 'Account aanmaken...' : 'Admin account aanmaken'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate('/admin/login')}>
              Al een account? Inloggen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
