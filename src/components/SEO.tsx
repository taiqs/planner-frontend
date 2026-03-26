import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  image = '/og-image.png', 
  url = window.location.href,
  type = 'website'
}: SEOProps) {
  const siteName = "Ponto e Vírgula";
  const siteTitle = "Ponto e Vírgula - Planner de Psicanálise & Bem-Estar";
  const defaultDescription = "O Ponto e Vírgula é seu aliado na jornada terapêutica. Organize reflexões, registre áudios e prepare-se para suas sessões com a Dra. Tailiny.";
  
  const fullTitle = title ? `${title} | ${siteName}` : siteTitle;
  const fullDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content="psicanálise, terapia, saúde mental, diário emocional, cofre, psicóloga, autoconhecimento, planner" />
      <meta name="author" content="Ponto e Vírgula" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
