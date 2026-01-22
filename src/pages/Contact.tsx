import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { Header } from '@/components/news/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SEOHead } from '@/components/seo/SEOHead'
import { useToast } from '@/hooks/use-toast'

export default function Contact() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Bericht verzonden",
      description: "Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.",
    })
    
    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact"
        description="Neem contact op met NewsFlow voor vragen, opmerkingen of verwijderingsverzoeken."
      />
      
      <Header />
      
      <main className="container py-8 max-w-3xl">
        <Link to="/" className="inline-flex mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Heeft u vragen, opmerkingen of een verwijderingsverzoek? Neem gerust contact met ons op.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Naam</Label>
                <Input id="name" name="name" required placeholder="Uw naam" />
              </div>
              <div>
                <Label htmlFor="email">E-mailadres</Label>
                <Input id="email" name="email" type="email" required placeholder="uw@email.nl" />
              </div>
              <div>
                <Label htmlFor="subject">Onderwerp</Label>
                <Input id="subject" name="subject" required placeholder="Waar gaat uw bericht over?" />
              </div>
              <div>
                <Label htmlFor="message">Bericht</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  placeholder="Uw bericht..."
                  rows={5}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  "Verzenden..."
                ) : (
                  <>
                    Verstuur bericht
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact informatie
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Wij streven ernaar om binnen 48 uur te reageren op alle berichten.
              </p>
              <p className="text-sm">
                <strong>E-mail:</strong>{' '}
                <a href="mailto:info@newsflow.nl" className="text-primary hover:underline">
                  info@newsflow.nl
                </a>
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Verwijderingsverzoeken</h3>
              <p className="text-sm text-muted-foreground">
                Bent u een uitgever of rechthebbende en wilt u dat bepaalde content 
                wordt verwijderd? Vermeld in uw bericht:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
                <li>De URL van het betreffende artikel op NewsFlow</li>
                <li>De originele bron/URL</li>
                <li>Uw relatie tot de content</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
