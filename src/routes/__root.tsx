import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Letícia de Andrade | Arquiteta de Interiores em Porto Belo e Itapema, SC"},
      { name: "description", content: "Arquiteta de interiores em Porto Belo e Itapema, SC. Projetos residenciais personalizados com foco em iluminacao, layout e valorizacao do imovel." },
      { property: "og:title", content:"Letícia de Andrade | Arquiteta de Interiores em Porto Belo, SC" },
      { property: "og:description", content: "Arquiteta de interiores em Porto Belo e Itapema, SC. Projetos residenciais personalizados com foco em iluminacao, layout e valorizacao do imovel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Letícia de Andrade | Arquiteta de Interiores em Porto Belo, SC" },
      { name: "twitter:description", content: "Arquiteta de interiores em Porto Belo e Itapema, SC. Projetos residenciais com fidelidade ao projeto" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/l8s1qSIDdCfMq2ghgRiG3z2NBKr1/social-images/social-1777409609606-DSC08672202.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/l8s1qSIDdCfMq2ghgRiG3z2NBKr1/social-images/social-1777409609606-DSC08672202.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Letícia de Andrade Arquitetura e Interiores",
          "description": "Arquiteta e designer de interiores em Porto Belo e Itapema, SC. Projetos residenciais personalizados com foco em iluminação, layout e valorização do imóvel.",
          "url": "https://leticiadeandradearquitetura.com",
          "telephone": "+554999993040",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Porto Belo",
            "addressRegion": "SC",
            "addressCountry": "BR"
          },
          "areaServed": ["Porto Belo", "Itapema", "Bombinhas", "Balneário Camboriú", "Navegantes"]
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
