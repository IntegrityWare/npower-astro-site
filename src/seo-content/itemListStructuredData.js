import { PRODUCTS, SAMPLE_VIDEOS, WORKFLOWS } from '@/lib/siteData.js';
import { absoluteUrl } from '@/lib/siteUrl.js';

const list = (name, url, items) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl(url)}#itemlist`,
  name,
  url: absoluteUrl(url),
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
  '@id': `${absoluteUrl(product.path)}#software`,
  name: product.name,
  description: product.tagline,
  url: absoluteUrl(product.path),
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
    '@id': `${absoluteUrl(workflow.path)}#webpage`,
    name: workflow.name,
    description: workflow.description,
    url: absoluteUrl(workflow.path),
    image: absoluteUrl(workflow.image),
  })),
);

export const videoLibraryItemList = list(
  'Power Surfacing video library',
  '/resources/videos',
  SAMPLE_VIDEOS.map((video) => ({
    '@type': 'VideoObject',
    '@id': `${absoluteUrl(`/resources/videos/${video.id}`)}#video`,
    name: video.title,
    description: `${video.type} covering ${video.workflow} with ${video.product}.`,
    url: absoluteUrl(`/resources/videos/${video.id}`),
    thumbnailUrl: [video.thumbnail],
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  })),
);
