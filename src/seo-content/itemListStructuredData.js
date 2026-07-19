import { PRODUCTS, SAMPLE_VIDEOS, WORKFLOWS } from '@/lib/siteData.js';

const SITE = 'https://www.npowersoftwarenew.com';

const absoluteUrl = (path) => (path.startsWith('http') ? path : `${SITE}${path}`);

const list = (name, url, items) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE}${url}#itemlist`,
  name,
  url: `${SITE}${url}`,
  numberOfItems: items.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item,
  })),
});

const productItems = PRODUCTS.map((product) => ({
  '@type': 'SoftwareApplication',
  '@id': `${SITE}${product.path}#software`,
  name: product.name,
  description: product.tagline,
  url: `${SITE}${product.path}`,
  image: absoluteUrl(product.image),
  applicationCategory: product.category,
  operatingSystem: 'Windows',
}));

export const productOverviewItemList = list(
  'Power Surfacing products',
  '/products',
  productItems,
);

export const productComparisonItemList = list(
  'Power Surfacing product comparison',
  '/products/comparison',
  productItems,
);

export const workflowOverviewItemList = list(
  'Power Surfacing workflows',
  '/workflows',
  WORKFLOWS.map((workflow) => ({
    '@type': 'WebPage',
    '@id': `${SITE}${workflow.path}#webpage`,
    name: workflow.name,
    description: workflow.description,
    url: `${SITE}${workflow.path}`,
    image: absoluteUrl(workflow.image),
  })),
);

export const videoLibraryItemList = list(
  'Power Surfacing video library',
  '/resources/videos',
  SAMPLE_VIDEOS.map((video) => ({
    '@type': 'VideoObject',
    '@id': `${SITE}/resources/videos/${video.id}#video`,
    name: video.title,
    description: `${video.type} covering ${video.workflow} with ${video.product}.`,
    url: `${SITE}/resources/videos/${video.id}`,
    thumbnailUrl: [video.thumbnail],
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  })),
);
