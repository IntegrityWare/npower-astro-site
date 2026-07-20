import { PATENTS } from '@/lib/patentsData.js';
import { ORGANIZATION_ID, absoluteUrl } from '@/lib/siteUrl.js';

const GARY = absoluteUrl('/about#gary-crocker');

const person = (name) => name === 'Gary A. Crocker'
  ? { '@type': 'Person', '@id': GARY, name: 'Gary Crocker' }
  : { '@type': 'Person', name };

export const patentsItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl('/patents')}#itemlist`,
  name: 'United States patents naming Gary Crocker as an inventor',
  url: absoluteUrl('/patents'),
  numberOfItems: PATENTS.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: PATENTS.map((patent, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Patent',
      '@id': patent.url,
      name: patent.title,
      patentNumber: patent.number.replace('US ', '').replaceAll(',', ''),
      identifier: patent.number,
      inventor: patent.inventors.map(person),
      datePublished: patent.issueDate,
      status: 'Issued',
      countryOfOrigin: {
        '@type': 'Country',
        name: 'United States',
      },
      url: patent.url,
      sameAs: patent.url,
      about: patent.assignee === 'IntegrityWare, Inc.'
        ? { '@id': ORGANIZATION_ID }
        : { '@type': 'Organization', name: patent.assignee },
    },
  })),
};
