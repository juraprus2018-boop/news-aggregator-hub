-- Add slug column to articles table
ALTER TABLE public.articles ADD COLUMN slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX articles_slug_key ON public.articles(slug) WHERE slug IS NOT NULL;

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  base_slug := lower(title);
  -- Replace common Dutch characters
  base_slug := replace(base_slug, 'ë', 'e');
  base_slug := replace(base_slug, 'ï', 'i');
  base_slug := replace(base_slug, 'ü', 'u');
  base_slug := replace(base_slug, 'ö', 'o');
  base_slug := replace(base_slug, 'ä', 'a');
  base_slug := replace(base_slug, 'é', 'e');
  base_slug := replace(base_slug, 'è', 'e');
  base_slug := replace(base_slug, 'ê', 'e');
  base_slug := replace(base_slug, 'à', 'a');
  base_slug := replace(base_slug, 'ù', 'u');
  base_slug := replace(base_slug, 'û', 'u');
  base_slug := replace(base_slug, 'ç', 'c');
  base_slug := replace(base_slug, 'ñ', 'n');
  -- Replace spaces and multiple hyphens
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  -- Trim hyphens from start and end
  base_slug := trim(both '-' from base_slug);
  -- Limit length to 80 characters
  base_slug := left(base_slug, 80);
  
  final_slug := base_slug;
  
  -- Check for duplicates and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.articles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Create trigger to auto-generate slug on insert
CREATE OR REPLACE FUNCTION public.set_article_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_article_slug
  BEFORE INSERT ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_article_slug();

-- Generate slugs for existing articles
UPDATE public.articles SET slug = public.generate_slug(title) WHERE slug IS NULL;