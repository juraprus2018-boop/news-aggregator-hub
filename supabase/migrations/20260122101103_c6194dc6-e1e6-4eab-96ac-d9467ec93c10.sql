-- Create site_settings table for caching sitemap and other settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access for sitemap
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read site settings (sitemap needs to be public)
CREATE POLICY "Site settings are publicly readable" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only service role can insert/update (edge function uses service role)
CREATE POLICY "Only service role can modify site settings" 
ON public.site_settings 
FOR ALL 
USING (false)
WITH CHECK (false);