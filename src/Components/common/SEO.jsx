import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'NEXA';
const DEFAULT_ORIGIN = 'https://nexa-projects-168.vercel.app';
const DEFAULT_THUMBNAIL = `${DEFAULT_ORIGIN}/thumbnail.jpg`;
const DEFAULT_LOGO = `${DEFAULT_ORIGIN}/nexa-orbit-logo.svg`;
const DEFAULT_TITLE = 'NEXA — Network, Explore, eXchange, Assist | Cambodian Tech Community';
const DEFAULT_DESCRIPTION = "NEXA is Cambodia's premier developer and student platform for technical Q&A collaboration, programming assistance, knowledge exchange, and campus Lost & Found recovery.";
const DEFAULT_KEYWORDS = 'NEXA, NEXA Cambodia, Cambodian Developers, Cambodia Tech Community, ISTAD, Programming Q&A, Lost and Found Cambodia, Code Collaboration, Web Development, Phnom Penh Tech, AskKh';

/**
 * Custom SEO hook & component for NEXA
 * Manages document title, meta descriptions, canonical URLs,
 * Open Graph, Twitter cards, Social Bots (Facebook, Telegram, Instagram, LinkedIn, WhatsApp),
 * and dynamic JSON-LD Schema.org structured data.
 */
export function usePageSEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_THUMBNAIL,
  imageAlt = 'NEXA — Network, Explore, eXchange, Assist',
  type = 'website',
  noIndex = false,
  canonicalUrl = null,
  author = 'NEXA Community',
  publishedTime = null,
  modifiedTime = null,
  tags = [],
  structuredData = null,
} = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Update Title
    let formattedTitle = title;
    if (!title.includes('NEXA')) {
      formattedTitle = `${title} | ${SITE_NAME}`;
    }
    document.title = formattedTitle;

    // Helper to create or update meta tags
    const updateMeta = (nameOrProperty, key, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[${nameOrProperty}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameOrProperty, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : DEFAULT_ORIGIN;

    const currentUrl = canonicalUrl || `${origin}${pathname}`;
    const absoluteImage = image.startsWith('http')
      ? image
      : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;

    // 2. Primary Standard SEO Meta Tags
    updateMeta('name', 'title', formattedTitle);
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);
    updateMeta('name', 'author', author);
    updateMeta('name', 'publisher', 'NEXA');
    updateMeta('name', 'application-name', SITE_NAME);
    updateMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('name', 'googlebot', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 3. Open Graph Meta (Facebook, Telegram, Instagram, WhatsApp, LinkedIn, Discord)
    updateMeta('property', 'og:site_name', SITE_NAME);
    updateMeta('property', 'og:title', formattedTitle);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', absoluteImage);
    updateMeta('property', 'og:image:secure_url', absoluteImage);
    updateMeta('property', 'og:image:type', absoluteImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    updateMeta('property', 'og:image:width', '1200');
    updateMeta('property', 'og:image:height', '630');
    updateMeta('property', 'og:image:alt', imageAlt || formattedTitle);
    updateMeta('property', 'og:url', currentUrl);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:locale', 'en_US');
    updateMeta('property', 'og:locale:alternate', 'km_KH');

    if (publishedTime) {
      updateMeta('property', 'article:published_time', publishedTime);
    }
    if (modifiedTime) {
      updateMeta('property', 'article:modified_time', modifiedTime);
    }
    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach(tag => updateMeta('property', 'article:tag', tag));
    }

    // 4. Twitter / X Card & Telegram Previews
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:site', '@nexa_platform');
    updateMeta('name', 'twitter:creator', '@nexa_platform');
    updateMeta('name', 'twitter:title', formattedTitle);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', absoluteImage);
    updateMeta('name', 'twitter:image:alt', imageAlt || formattedTitle);
    updateMeta('name', 'twitter:url', currentUrl);

    // 5. Telegram specific tag
    updateMeta('name', 'telegram:channel', '@nexa_community');

    // 6. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 7. Dynamic JSON-LD Structured Data (Schema.org)
    const dynamicSchemaId = 'nexa-dynamic-json-ld';
    let schemaScript = document.getElementById(dynamicSchemaId);
    
    const pageSchema = structuredData || {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'TechArticle' : 'WebPage',
      '@id': `${currentUrl}#webpage`,
      url: currentUrl,
      name: formattedTitle,
      description: description,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${DEFAULT_ORIGIN}/#website`,
        name: SITE_NAME,
        url: DEFAULT_ORIGIN,
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${DEFAULT_ORIGIN}/#organization`,
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_LOGO,
        },
      },
      image: absoluteImage,
      inLanguage: ['en-US', 'km-KH'],
    };

    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('id', dynamicSchemaId);
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(pageSchema, null, 2);

    return () => {
      // Optional cleanup on component unmount if needed
    };
  }, [
    title,
    description,
    keywords,
    image,
    imageAlt,
    type,
    noIndex,
    canonicalUrl,
    author,
    publishedTime,
    modifiedTime,
    tags,
    structuredData,
    pathname,
  ]);
}

export default function SEO(props) {
  usePageSEO(props);
  return null;
}
