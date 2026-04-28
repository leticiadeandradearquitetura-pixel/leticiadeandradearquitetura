-- 1. Add new columns to projetos
ALTER TABLE public.projetos
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS descricao text,
  ADD COLUMN IF NOT EXISTS local text,
  ADD COLUMN IF NOT EXISTS area text,
  ADD COLUMN IF NOT EXISTS ano text;

-- Backfill slug from nome for existing rows
UPDATE public.projetos
SET slug = lower(regexp_replace(translate(nome,
  'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
  'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'),
  '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 6)
WHERE slug IS NULL;

ALTER TABLE public.projetos
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS projetos_slug_unique ON public.projetos(slug);

-- 2. Create projeto_imagens table
CREATE TABLE IF NOT EXISTS public.projeto_imagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id uuid NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
  url text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projeto_imagens_projeto_id_idx ON public.projeto_imagens(projeto_id);

ALTER TABLE public.projeto_imagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projeto_imagens"
ON public.projeto_imagens FOR SELECT
USING (true);

CREATE POLICY "Admins manage projeto_imagens"
ON public.projeto_imagens FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));