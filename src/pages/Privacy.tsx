import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/layout/Footer'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { SEOHead } from '@/components/seo/SEOHead'

export default function Privacy() {
  return (
    <MainLayout showSidebar={false}>
      <SEOHead
        title="Privacybeleid"
        description="Lees het privacybeleid van GigaNieuws. Wij respecteren uw privacy en leggen uit hoe wij omgaan met uw gegevens."
      />
      
      <main className="container py-8 max-w-3xl">
        <Link to="/" className="inline-flex mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Privacybeleid</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-6">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2>1. Wie zijn wij?</h2>
          <p>
            GigaNieuws is een nieuwsaggregator die artikelen verzamelt van verschillende 
            Nederlandse nieuwsbronnen via publiek beschikbare RSS-feeds. Wij creëren 
            geen eigen nieuwscontent.
          </p>

          <h2>2. Welke gegevens verzamelen wij?</h2>
          <p>GigaNieuws verzamelt minimale gegevens:</p>
          <ul>
            <li><strong>Geen persoonlijke gegevens:</strong> Wij vragen niet om registratie of inloggegevens van bezoekers.</li>
            <li><strong>Technische gegevens:</strong> Standaard serverlogboeken kunnen IP-adressen en browserinformatie bevatten voor technische doeleinden.</li>
            <li><strong>Cookies:</strong> Wij gebruiken alleen functionele cookies die nodig zijn voor de werking van de website.</li>
          </ul>

          <h2>3. Hoe gebruiken wij uw gegevens?</h2>
          <p>
            Eventuele technische gegevens worden uitsluitend gebruikt voor:
          </p>
          <ul>
            <li>Het verbeteren van de website-ervaring</li>
            <li>Het oplossen van technische problemen</li>
            <li>Het beveiligen van de website</li>
          </ul>

          <h2>4. Delen wij uw gegevens?</h2>
          <p>
            Nee. Wij verkopen, verhuren of delen geen persoonlijke gegevens met derden 
            voor commerciële doeleinden.
          </p>

          <h2>5. Externe links</h2>
          <p>
            GigaNieuws bevat links naar externe nieuwsbronnen. Wanneer u op een link klikt 
            naar een externe website, bent u onderworpen aan het privacybeleid van die website. 
            Wij zijn niet verantwoordelijk voor de privacypraktijken van externe websites.
          </p>

          <h2>6. Uw rechten</h2>
          <p>
            Onder de AVG heeft u het recht om:
          </p>
          <ul>
            <li>Inzage te vragen in eventuele opgeslagen gegevens</li>
            <li>Correctie of verwijdering te verzoeken</li>
            <li>Bezwaar te maken tegen verwerking</li>
          </ul>

          <h2>7. Contact</h2>
          <p>
            Voor vragen over dit privacybeleid kunt u contact met ons opnemen via de 
            contactpagina.
          </p>
        </div>
      </main>

      <Footer />
    </MainLayout>
  )
}
