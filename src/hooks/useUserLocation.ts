import { useState, useEffect } from 'react'
import type { Category } from '@/types/news'

interface LocationInfo {
  country: string | null
  suggestedCategory: Category
  isLoading: boolean
}

export function useUserLocation(): LocationInfo {
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    country: null,
    suggestedCategory: 'all',
    isLoading: true,
  })

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // First try browser language/timezone hints
        const language = navigator.language || navigator.languages?.[0] || ''
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        
        // Check if user is likely Dutch
        const isDutch = 
          language.toLowerCase().startsWith('nl') ||
          timezone.includes('Amsterdam') ||
          timezone.includes('Europe/Amsterdam')

        if (isDutch) {
          setLocationInfo({
            country: 'Nederland',
            suggestedCategory: 'nederland',
            isLoading: false,
          })
          return
        }

        // Try free IP geolocation as fallback
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000),
        })
        
        if (response.ok) {
          const data = await response.json()
          const countryCode = data.country_code?.toUpperCase()
          
          if (countryCode === 'NL') {
            setLocationInfo({
              country: 'Nederland',
              suggestedCategory: 'nederland',
              isLoading: false,
            })
          } else {
            setLocationInfo({
              country: data.country_name || 'Unknown',
              suggestedCategory: 'internationaal',
              isLoading: false,
            })
          }
        } else {
          throw new Error('Geolocation failed')
        }
      } catch {
        // Default to 'all' if detection fails
        setLocationInfo({
          country: null,
          suggestedCategory: 'all',
          isLoading: false,
        })
      }
    }

    detectLocation()
  }, [])

  return locationInfo
}
