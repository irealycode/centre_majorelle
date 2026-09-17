import { site, locales, url, asset } from './site.mjs';

const SCHEMA_DAYS = [
  'https://schema.org/Sunday',
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
  'https://schema.org/Friday',
  'https://schema.org/Saturday',
];

const CLINIC_ID = `${site.origin}/#clinic`;
const WEBSITE_ID = `${site.origin}/#website`;
const DENTIST_ID = `${site.origin}/#dentist`;

/** One openingHoursSpecification entry per interval per day. */
function openingHours() {
  const out = [];
  for (const [day, intervals] of Object.entries(site.hours)) {
    for (const [opens, closes] of intervals) {
      out.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SCHEMA_DAYS[Number(day)],
        opens,
        closes,
      });
    }
  }
  return out;
}

function sameAs() {
  return Object.values(site.social).filter(Boolean);
}

/**
 * The clinic itself. Emitted on every page with the same @id so the whole
 * site resolves to one business entity.
 *
 * Deliberately omits aggregateRating / review: inventing them would be
 * fabricated structured data and is a manual-action risk.
 */
export function clinicNode(L, services) {
  const isAr = L === 'ar';
  const node = {
    '@type': ['Dentist', 'MedicalClinic'],
    '@id': CLINIC_ID,
    name: isAr ? site.nameAr : site.name,
    alternateName: isAr ? site.name : site.nameAr,
    url: url(L, 'home'),
    telephone: site.phone,
    email: site.email,
    image: [
      `${site.origin}${asset('/assets/img/reception-1280.jpg')}`,
      `${site.origin}${asset('/assets/img/facade-nuit-1280.jpg')}`,
    ],
    // The real lockup, not a logo.svg that was never generated.
    logo: `${site.origin}${asset('/assets/img/logo-lockup-ink.png')}`,
    priceRange: '$$',
    currenciesAccepted: 'MAD',
    medicalSpecialty: 'https://schema.org/Dentistry',
    address: {
      '@type': 'PostalAddress',
      streetAddress: isAr ? site.streetAr : site.street,
      addressLocality: isAr ? site.cityAr : site.city,
      addressRegion: isAr ? site.regionAr : site.region,
      postalCode: site.postal,
      addressCountry: site.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.lat,
      longitude: site.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`,
    openingHoursSpecification: openingHours(),
    areaServed: site.areaServed.map((n) => ({ '@type': 'City', name: n })),
    availableLanguage: site.languages.map((c) => ({
      '@type': 'Language',
      name: c === 'fr' ? 'French' : c === 'ar' ? 'Arabic' : 'Spanish',
      alternateName: c,
    })),
    employee: { '@id': DENTIST_ID },
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'MedicalProcedure', name: s.name },
    })),
  };
  const links = sameAs();
  if (links.length) node.sameAs = links;
  return node;
}

export function dentistNode(L) {
  return {
    '@type': ['Person', 'Dentist'],
    '@id': DENTIST_ID,
    name: L === 'ar' ? site.dentistAr : site.dentist,
    jobTitle: L === 'ar' ? 'جرّاح أسنان' : site.dentistHonorific,
    worksFor: { '@id': CLINIC_ID },
  };
}

export function websiteNode(L) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: url(L, 'home'),
    name: L === 'ar' ? site.nameAr : site.name,
    inLanguage: locales[L].htmlLang,
    publisher: { '@id': CLINIC_ID },
  };
}

export function webPageNode(L, { canonical, title, description, image }) {
  return {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: locales[L].htmlLang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': CLINIC_ID },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: image } : undefined,
  };
}

export function breadcrumbNode(canonical, trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqNode(canonical, items) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function serviceNode(L, canonical, service) {
  return {
    '@type': 'MedicalProcedure',
    '@id': `${canonical}#procedure`,
    name: service.name,
    description: service.short,
    url: canonical,
    provider: { '@id': CLINIC_ID },
    procedureType: 'https://schema.org/TherapeuticProcedure',
    howPerformed: service.steps.items.map((s) => `${s[0]} — ${s[1]}`).join(' '),
  };
}

/** Strip undefined, wrap in @graph, and make it safe to embed in HTML. */
export function jsonLd(nodes) {
  const graph = { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
  return JSON.stringify(graph, (k, v) => (v === undefined ? undefined : v))
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
