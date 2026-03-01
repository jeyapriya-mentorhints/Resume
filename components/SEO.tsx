import { Helmet } from "react-helmet-async";

const SITE_NAME = "ATS Free Resume";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  schema?: object; 
}

const SITE_URL = "https://atsfreeresume.in";

export default function SEO({
  title,
  description,
  canonical,
  ogImage = "/og/default.png",
  noindex = false,
  schema
}: SEOProps) {
  const fullOgImage = `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{title} | ATS Free Resume</title>

      <meta name="description" content={description} />

      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow"}
      />

      <link rel="canonical" href={`${SITE_URL}${canonical}`} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${title} | ATS Free Resume`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE_URL}${canonical}`} />
      <meta property="og:image" content={fullOgImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ATS Free Resume`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />


      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
