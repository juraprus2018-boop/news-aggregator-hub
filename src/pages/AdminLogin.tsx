import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useAdminCheck } from '@/hooks/useAdminCheck'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const { isAdmin, loading, user } = useAdminCheck()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin')
    }
  }, [loading, user, isAdmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast({
        title: 'Inloggen mislukt',
        description: error.message,
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    // After login, useAdminCheck will trigger and redirect if admin
    setIsLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
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
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Log in om het beheerdersdashboard te openen
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <Button variant="link" onClick={() => navigate('/admin/register')}>
              Nog geen account? Registreren
            </Button>
            <br />
            <Button variant="link" onClick={() => navigate('/')}>
              ← Terug naar nieuws
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
