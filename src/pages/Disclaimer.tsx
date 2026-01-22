import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/news/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { SEOHead } from '@/components/seo/SEOHead'

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Disclaimer"
        description="Lees de disclaimer van GigaNieuws. Informatie over onze nieuwsaggregator en de bronnen die wij gebruiken."
      />
      
      <Header />
      
      <main className="container py-8 max-w-3xl">
        <Link to="/" className="inline-flex mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-6">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2>1. Wat is GigaNieuws?</h2>
          <p>
            GigaNieuws is een <strong>nieuwsaggregator</strong>. Dit betekent dat wij geen eigen 
            nieuwsartikelen schrijven of produceren. In plaats daarvan verzamelen wij 
            samenvattingen van nieuwsartikelen van diverse Nederlandse nieuwsbronnen via 
            hun publiek beschikbare RSS-feeds.
          </p>

          <h2>2. Auteursrecht</h2>
          <p>
            Alle artikelen, afbeeldingen, video's en andere content die op GigaNieuws worden 
            getoond, blijven volledig eigendom van de oorspronkelijke uitgevers en auteurs. 
            Wij claimen geen eigendomsrechten op deze content.
          </p>
          <p>
            GigaNieuws toont uitsluitend:
          </p>
          <ul>
            <li>Titels en korte samenvattingen zoals aangeboden in RSS-feeds</li>
            <li>Thumbnails/voorbeeldafbeeldingen met bronvermelding</li>
            <li>Directe links naar de originele artikelen</li>
          </ul>

          <h2>3. Bronvermelding</h2>
          <p>
            Bij elk artikel vermelden wij duidelijk de oorspronkelijke bron. Wij moedigen 
            gebruikers aan om de volledige artikelen te lezen op de website van de 
            oorspronkelijke uitgever.
          </p>

          <h2>4. Verwijderingsverzoeken</h2>
          <p>
            Bent u een uitgever of rechthebbende en wilt u dat uw content niet meer via 
            GigaNieuws wordt getoond? Neem dan contact met ons op. Wij zullen uw verzoek 
            zo snel mogelijk behandelen en de betreffende content verwijderen.
          </p>

          <h2>5. Aansprakelijkheid</h2>
          <p>
            NewsFlow is niet verantwoordelijk voor:
          </p>
          <ul>
            <li>De inhoud of accuraatheid van artikelen van externe bronnen</li>
            <li>Eventuele fouten of verouderde informatie in geaggregeerde content</li>
            <li>De beschikbaarheid of het functioneren van externe websites</li>
          </ul>

          <h2>6. Geen commercieel hergebruik</h2>
          <p>
            De geaggregeerde content op GigaNieuws mag niet worden gekopieerd, herverdeeld 
            of commercieel worden hergebruikt zonder toestemming van de oorspronkelijke 
            rechthebbenden.
          </p>

          <h2>7. Contact</h2>
          <p>
            Voor vragen, opmerkingen of verwijderingsverzoeken kunt u contact met ons 
            opnemen via de contactpagina.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
