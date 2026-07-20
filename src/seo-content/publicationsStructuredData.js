import { PUBLICATIONS, TECHNICAL_DOCUMENTS } from '@/lib/publicationsData.js';
import { absoluteUrl } from '@/lib/siteUrl.js';

const GARY = absoluteUrl('/about#gary-crocker');

const author = (name) => name === 'Gary A. Crocker'
  ? { '@type': 'Person', '@id': GARY, name: 'Gary Crocker' }
  : { '@type': 'Person', name };

const items = [
  ...PUBLICATIONS.map((work) => ({
    '@type': 'ScholarlyArticle',
    '@id': `https://doi.org/${work.doi}`,
    headline: work.title,
    name: work.title,
    author: work.authors.map(author),
    datePublished: work.date,
    pagination: work.pages,
    sameAs: `https://doi.org/${work.doi}`,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'DOI',
      value: work.doi,
    },
    isPartOf: {
      '@type': 'Periodical',
      name: work.publication,
      volumeNumber: work.volume,
      issueNumber: work.issue,
    },
    description: work.summary,
  })),
  ...TECHNICAL_DOCUMENTS.map((work, index) => ({
    '@type': 'CreativeWork',
    '@id': `${absoluteUrl('/publications')}#technical-document-${index + 1}`,
    name: work.title,
    author: work.authors.map(author),
    datePublished: work.date,
    genre: work.type,
    ...(work.publisher ? { publisher: { '@type': 'CollegeOrUniversity', name: work.publisher } } : {}),
    description: work.summary,
  })),
];

export const publicationsItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl('/publications')}#itemlist`,
  name: 'Gary Crocker publications and technical reports',
  url: absoluteUrl('/publications'),
  numberOfItems: items.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item,
  })),
};
