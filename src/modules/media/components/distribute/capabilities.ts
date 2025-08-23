import { Platform, PostFormat } from './types';

export const CAPABILITIES: Record<
  Platform,
  {
    allow: {
      image: boolean | 'photoModeOnly';
      video: boolean;
      pdf: boolean | 'asDocument';
      audio: boolean;
    };
    multi?: { imageMax?: number; imageMin?: number };
    prefers?: { imageRatio?: '1:1' | '4:5' | '16:9'; videoRatio?: '1:1' | '4:5' | '9:16' | '16:9' };
    formats: PostFormat[];
    notes?: string;
  }
> = {
  instagram: {
    allow: { image: true, video: true, pdf: false, audio: false },
    multi: { imageMin: 2, imageMax: 10 },
    prefers: { imageRatio: '4:5', videoRatio: '9:16' },
    formats: ['image_post', 'carousel', 'video_post', 'reel_short'],
  },
  facebook: {
    allow: { image: true, video: true, pdf: false, audio: false },
    multi: { imageMin: 2 },
    formats: ['image_post', 'carousel', 'video_post'],
  },
  tiktok: {
    allow: { image: 'photoModeOnly', video: true, pdf: false, audio: false },
    multi: { imageMin: 2, imageMax: 35 },
    prefers: { videoRatio: '9:16' },
    formats: ['video_post', 'tiktok_photo_mode', 'reel_short'],
  },
  x: {
    allow: { image: true, video: true, pdf: false, audio: false },
    multi: { imageMin: 2, imageMax: 4 },
    formats: ['image_post', 'carousel', 'video_post'], // carousel maps to multi-image tweet
  },
  linkedin: {
    allow: { image: true, video: true, pdf: 'asDocument', audio: false },
    multi: { imageMin: 2 },
    formats: ['image_post', 'carousel', 'video_post', 'linkedin_document'],
  },
  youtube: {
    allow: { image: false, video: true, pdf: false, audio: false },
    prefers: { videoRatio: '16:9' },
    formats: ['video_post'],
  },
  pinterest: {
    allow: { image: true, video: true, pdf: false, audio: false },
    // No multi-image pins here; keep it to single-asset
    formats: ['pin', 'image_post', 'video_post'],
  },
};

export const getFormatIntersection = (platforms: Platform[]): PostFormat[] => {
  if (platforms.length === 0) {
    return [];
  }
  return platforms
    .map((p) => CAPABILITIES[p].formats)
    .reduce<PostFormat[]>(
      (acc, cur) => acc.filter((f) => cur.includes(f)),
      CAPABILITIES[platforms[0]].formats
    );
};

type SimpleAsset = { kind: 'image' | 'video' | 'audio' | 'pdf' };

export const isFormatCompatibleWithAssets = (
  format: PostFormat,
  assets: SimpleAsset[],
  platforms: Platform[]
): { compatible: boolean; reasons: string[] } => {
  const reasons: string[] = [];

  const imageCount = assets.filter((a) => a.kind === 'image').length;
  const videoCount = assets.filter((a) => a.kind === 'video').length;
  const audioCount = assets.filter((a) => a.kind === 'audio').length;
  const pdfCount = assets.filter((a) => a.kind === 'pdf').length;

  switch (format) {
    case 'image_post': {
      if (imageCount !== 1) {
        reasons.push('Select exactly 1 image (use "Carousel" for multiple).');
      }
      if (videoCount || audioCount || pdfCount) {
        reasons.push('Images only.');
      }
      break;
    }
    case 'carousel': {
      if (imageCount < 2) {
        reasons.push('Requires at least 2 images.');
      }
      if (videoCount || audioCount || pdfCount) {
        reasons.push('Images only.');
      }
      // per-platform min/max
      for (const p of platforms) {
        const m = CAPABILITIES[p].multi;
        if (m?.imageMin && imageCount < m.imageMin) {
          reasons.push(`Not enough images for ${p} (min ${m.imageMin}).`);
        }
        if (m?.imageMax && imageCount > m.imageMax) {
          reasons.push(`Too many images for ${p} (max ${m.imageMax}).`);
        }
      }
      break;
    }
    case 'video_post':
    case 'reel_short': {
      if (videoCount !== 1) {
        reasons.push('Select exactly 1 video.');
      }
      if (imageCount || audioCount || pdfCount) {
        reasons.push('Video only.');
      }
      break;
    }
    case 'tiktok_photo_mode': {
      if (imageCount < 2) {
        reasons.push('Requires at least 2 images.');
      }
      if (videoCount || audioCount || pdfCount) {
        reasons.push('Images only.');
      }
      break;
    }
    case 'linkedin_document': {
      if (pdfCount !== 1) {
        reasons.push('Select exactly 1 PDF.');
      }
      if (imageCount || videoCount || audioCount) {
        reasons.push('PDF only.');
      }
      break;
    }
    case 'pin': {
      const total = imageCount + videoCount;
      if (total !== 1) {
        reasons.push('Pinterest Pin uses exactly 1 image or 1 video.');
      }
      if (audioCount || pdfCount) {
        reasons.push('Pin cannot include audio or PDF.');
      }
      if (imageCount && videoCount) {
        reasons.push('Do not mix image and video.');
      }
      break;
    }
    default:
      reasons.push(`Unknown format: ${format}`);
      break;
  }

  return { compatible: reasons.length === 0, reasons };
};
