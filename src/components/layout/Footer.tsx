import { Link } from 'react-router-dom'
import { Newspaper, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30 mt-12">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">GigaNieuws</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              GigaNieuws is een nieuwsaggregator die het laatste nieuws uit Nederland 
              verzamelt van betrouwbare bronnen. Wij creëren geen eigen content, 
              maar bieden een overzichtelijk platform om nieuws te ontdekken.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigatie</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/?category=nederland" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nederland
                </Link>
              </li>
              <li>
                <Link to="/?category=internationaal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Internationaal
                </Link>
              </li>
              <li>
                <Link to="/?category=tech" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Juridisch</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Disclaimer */}
        <div className="bg-background/50 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-sm mb-2">📰 Over GigaNieuws</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            GigaNieuws is een nieuwsaggregator die artikelen verzamelt via publiek beschikbare 
            RSS-feeds van Nederlandse nieuwsbronnen. Alle artikelen, afbeeldingen en content 
            blijven eigendom van de oorspronkelijke uitgevers. Wij tonen enkel samenvattingen 
            en verwijzen altijd door naar de originele bron. Door gebruik te maken van GigaNieuws 
            stemt u in met ons privacybeleid. Voor vragen of verzoeken tot verwijdering kunt u 
            contact met ons opnemen.
          </p>
        </div>

        {/* Sources Attribution */}
        <div className="mb-8">
          <p className="text-xs text-muted-foreground text-center">
            Bronnen: NOS, RTL Nieuws, NU.nl, AD, De Telegraaf, de Volkskrant, Trouw, Het Parool, 
            Omroep Brabant, NH Nieuws, RTV Noord, Omroep Gelderland, RTV Utrecht, L1, Omroep Zeeland en meer.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} GigaNieuws — Al het nieuws, één plek</p>
          <p className="flex items-center gap-1">
            Een nieuwsaggregator, geen nieuwsproducent
          </p>
        </div>
      </div>
    </footer>
  )
}
