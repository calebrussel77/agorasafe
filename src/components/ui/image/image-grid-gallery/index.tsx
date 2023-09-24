import dynamic from 'next/dynamic';

const ImageGridGallery = dynamic(
  () => import('./image-grid-gallery').then(mod => mod.ImageGridGalleryClient),
  {
    ssr: false,
  }
);

export { ImageGridGallery };
