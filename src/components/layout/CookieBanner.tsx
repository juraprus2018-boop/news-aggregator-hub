import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'newsflow-cookie-consent'

type ConsentStatus = 'pending' | 'accepted' | 'declined'

export function CookieBanner() {
  const [status, setStatus] = useState<ConsentStatus>('pending')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === 'accepted' || stored === 'declined') {
      setStatus(stored as ConsentStatus)
      setIsVisible(false)
    } else {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setStatus('accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setStatus('declined')
    setIsVisible(false)
  }

  if (!isVisible || status !== 'pending') {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="container max-w-4xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon & Text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">🍪 Cookies op NewsFlow</h3>
                <p className="text-sm text-muted-foreground">
                  Wij gebruiken alleen functionele cookies die nodig zijn voor de werking van de website. 
                  Geen tracking of advertentiecookies.{' '}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    Lees ons privacybeleid
                  </Link>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex-1 sm:flex-none"
              >
                Weigeren
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 sm:flex-none"
              >
                Accepteren
              </Button>
            </div>

            {/* Close button (mobile) */}
            <button
              onClick={handleDecline}
              className="absolute top-2 right-2 sm:hidden p-1 text-muted-foreground hover:text-foreground"
              aria-label="Sluiten"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
