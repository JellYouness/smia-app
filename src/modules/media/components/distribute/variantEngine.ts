import { ApprovedAsset, Variant } from './types';

const generateVariantId = (originalId: string, transformation: string): string => {
  return `${originalId}_${transformation}_${Date.now()}`;
};

export const packIntoCarousel = (images: ApprovedAsset[]): ApprovedAsset[] => {
  if (images.length <= 1) {
    return images;
  }

  const firstImage = images[0];
  const packedAsset: ApprovedAsset = {
    ...firstImage,
    id: generateVariantId(firstImage.id, 'carousel'),
    name: `Carousel (${images.length} images)`,
    tags: [...(firstImage.tags || []), 'carousel', 'generated'],
  };

  return [packedAsset];
};

export const trimToMaxImages = (images: ApprovedAsset[], max: number): ApprovedAsset[] => {
  return images.slice(0, max);
};

export const makeVerticalVideo = (asset: ApprovedAsset): ApprovedAsset => {
  if (asset.kind !== 'video') {
    return asset;
  }

  return {
    ...asset,
    id: generateVariantId(asset.id, 'vertical'),
    name: `${asset.name} (9:16)`,
    width: 1080,
    height: 1920,
    tags: [...(asset.tags || []), '9:16', 'vertical', 'generated'],
  };
};

export const wrapAudioToMp4 = (asset: ApprovedAsset, cover?: ApprovedAsset): ApprovedAsset => {
  if (asset.kind !== 'audio') {
    return asset;
  }

  return {
    ...asset,
    id: generateVariantId(asset.id, 'audiogram'),
    kind: 'video',
    name: `${asset.name} (Audiogram)`,
    width: 1080,
    height: 1080,
    durationSec: asset.durationSec,
    tags: [...(asset.tags || []), 'audiogram', 'generated'],
  };
};

export const pdfToLinkedInDocument = (asset: ApprovedAsset): ApprovedAsset => {
  if (asset.kind !== 'pdf') {
    return asset;
  }

  return {
    ...asset,
    id: generateVariantId(asset.id, 'linkedin_doc'),
    name: `${asset.name} (LinkedIn Document)`,
    tags: [...(asset.tags || []), 'linkedin_document', 'generated'],
  };
};

export const padOrCropToRatio = (
  asset: ApprovedAsset,
  ratio: '1:1' | '4:5' | '9:16' | '16:9'
): ApprovedAsset => {
  if (asset.kind !== 'image' && asset.kind !== 'video') {
    return asset;
  }

  const ratioMap = {
    '1:1': { width: 1080, height: 1080 },
    '4:5': { width: 1080, height: 1350 },
    '9:16': { width: 1080, height: 1920 },
    '16:9': { width: 1920, height: 1080 },
  };

  const dimensions = ratioMap[ratio];

  return {
    ...asset,
    id: generateVariantId(asset.id, `ratio_${ratio.replace(':', '_')}`),
    name: `${asset.name} (${ratio})`,
    width: dimensions.width,
    height: dimensions.height,
    tags: [...(asset.tags || []), ratio, 'cropped', 'generated'],
  };
};

export const createVariantFromAsset = (asset: ApprovedAsset, transformation: string): Variant => {
  return {
    id: generateVariantId(asset.id, transformation),
    originalId: asset.id,
    kind: asset.kind,
    width: asset.width,
    height: asset.height,
    durationSec: asset.durationSec,
    name: asset.name,
    url: asset.url,
    transformation,
  };
};

export const getAssetRatio = (asset: ApprovedAsset): string => {
  if (!asset.width || !asset.height) {
    return '';
  }

  const ratio = asset.width / asset.height;

  if (Math.abs(ratio - 1) < 0.1) {
    return '1:1';
  }
  if (Math.abs(ratio - 0.8) < 0.1) {
    return '4:5';
  }
  if (Math.abs(ratio - 0.5625) < 0.1) {
    return '9:16';
  }
  if (Math.abs(ratio - 1.7778) < 0.1) {
    return '16:9';
  }

  return `${asset.width}:${asset.height}`;
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) {
    return '';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
