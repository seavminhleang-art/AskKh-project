import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom SEO hook & component for AskKh
 * Manages document title, meta descriptions, canonical URLs,
 * Open Graph, Twitter cards, and robots indexing directives dynamically.
 */
export function usePageSEO({
  title = 'AskKh | Cambodian Developer Community',
  description = 'AskKh is a modern community platform for developers and students in Cambodia to collaborate on technical Q&A and campus asset recovery.',
  keywords = 'AskKh, developer community, cambodia, Q&A, coding questions, lost and found, tech forum, ISTAD',
  image = '/thumbnail.jpg',
  type = 'website',
  noIndex = false,
  canonicalUrl = null,
} = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('AskKh') ? title : `${title} | AskKh`;
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

    // 2. Standard Meta
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);
    updateMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. Open Graph Meta
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://askkh.com';
    const currentUrl = canonicalUrl || `${origin}${pathname}`;
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;

    updateMeta('property', 'og:title', formattedTitle);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', absoluteImage);
    updateMeta('property', 'og:url', currentUrl);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:site_name', 'AskKh');

    // 4. Twitter Meta
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', formattedTitle);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', absoluteImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

  }, [title, description, keywords, image, type, noIndex, canonicalUrl, pathname]);
}

export default function SEO(props) {
  usePageSEO(props);
  return null;
}
