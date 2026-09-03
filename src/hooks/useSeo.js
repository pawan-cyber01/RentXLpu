import { useEffect } from 'react';

/**
 * Custom SEO hook to dynamically update page titles and meta tags for Google indexing
 */
export function useSeo({ title, description, keywords }) {
  useEffect(() => {
    // 1. Update Title
    const defaultTitle = 'RentX LPU — Buy, Rent & Sell Everything in Lovely Professional University (LPU)';
    document.title = title ? `${title} | RentX LPU` : defaultTitle;

    // 2. Update Description Meta Tag
    const defaultDesc = 'The official student-to-student marketplace for Lovely Professional University (LPU). Buy, rent, or sell books, calculators, cycles, and hostel essentials within LPU.';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || defaultDesc);

    // 3. Update Keywords Meta Tag
    const defaultKeywords = 'LPU, Lovely Professional University, RentX LPU, LPU marketplace, LPU buy sell rent, LPU hostel, LPU OLX, LPU student app, LPU BH3, LPU BH1, LPU GH1, LPU books, LPU cycle buy, LPU calculator rent';
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.name = 'keywords';
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute('content', keywords || defaultKeywords);

    // 4. Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title ? `${title} | RentX LPU` : defaultTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || defaultDesc);
  }, [title, description, keywords]);
}
