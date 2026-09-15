import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const APP_NAME = 'ISTAD Forum';
const DEFAULT_DESCRIPTION = 'ISTAD community discussions, questions, and answers.';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '');
  return configuredUrl || window.location.origin;
}

export default function Seo({ title, description = DEFAULT_DESCRIPTION, indexable = false, type = 'website' }) {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
    const canonicalUrl = `${getSiteUrl()}${location.pathname}`;
    const robots = indexable ? 'index,follow' : 'noindex,nofollow';

    document.title = pageTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [description, indexable, location.pathname, title, type]);

  return null;
}
