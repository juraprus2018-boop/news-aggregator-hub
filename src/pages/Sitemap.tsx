import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Sitemap() {
  const [sitemap, setSitemap] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      // Try to get cached sitemap first
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'sitemap_xml')
        .single();

      if (data?.value) {
        setSitemap(data.value);
      } else {
        // Generate fresh if no cache
        const response = await supabase.functions.invoke('generate-sitemap');
        if (response.data) {
          setSitemap(response.data);
        }
      }
    };

    fetchSitemap();
  }, []);

  useEffect(() => {
    if (sitemap) {
      // Create a Blob and redirect to it
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    }
  }, [sitemap]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Sitemap laden...</p>
    </div>
  );
}
