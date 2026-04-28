
-- Roles enum + user_roles table (security best practice: roles in separate table)
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role without recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_images: hero, sobre, etc. (key/value)
CREATE TABLE public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images"
  ON public.site_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage site images"
  ON public.site_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- projetos
CREATE TABLE public.projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  foto_url TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projetos"
  ON public.projetos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage projetos"
  ON public.projetos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_images_updated
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_projetos_updated
  BEFORE UPDATE ON public.projetos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed initial projetos
INSERT INTO public.projetos (nome, tipo, ordem) VALUES
  ('Apartamento Bleu', 'Interiores — Apartamento Novo', 1),
  ('Apartamento Sole', 'Interiores — Reforma', 2),
  ('Bruno Personal Studio', 'Arquitetônico — Porto Belo', 3),
  ('Apartamento Sana', 'Interiores — Itapema', 4);

-- Storage bucket: public read, admin write
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-fotos', 'site-fotos', true);

CREATE POLICY "Public read site-fotos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-fotos');

CREATE POLICY "Admins upload site-fotos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-fotos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update site-fotos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-fotos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete site-fotos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-fotos' AND public.has_role(auth.uid(), 'admin'));
