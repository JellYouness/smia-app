import { Channel, Platform } from './types';

export const CONNECTED_CHANNELS: Channel[] = [
  { id: 'ig_1', platform: 'instagram', name: 'IG • @LoveCats', tokenStatus: 'ok' },
  { id: 'fb_1', platform: 'facebook', name: 'FB • Love Cats Page', tokenStatus: 'ok' },
  { id: 'tt_1', platform: 'tiktok', name: 'TikTok • @love.cats', tokenStatus: 'ok' },
  { id: 'tw_1', platform: 'x', name: 'X • @LoveCatsNGO', tokenStatus: 'ok' },
  { id: 'li_1', platform: 'linkedin', name: 'LinkedIn • Love Cats ASBL', tokenStatus: 'ok' },
  { id: 'yt_1', platform: 'youtube', name: 'YouTube • Love Cats', tokenStatus: 'ok' },
  { id: 'pi_1', platform: 'pinterest', name: 'Pinterest • Love Cats', tokenStatus: 'ok' },
];

export const getPlatformLabel = (platform: Platform): string => {
  switch (platform) {
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'tiktok':
      return 'TikTok';
    case 'x':
      return 'X';
    case 'linkedin':
      return 'LinkedIn';
    case 'youtube':
      return 'YouTube';
    case 'pinterest':
      return 'Pinterest';
    default:
      return platform;
  }
};

export const getPlatformCapabilitiesText = (platform: Platform): string => {
  switch (platform) {
    case 'instagram':
      return 'Image / Video / Carousel / Reel';
    case 'facebook':
      return 'Image / Video / Carousel';
    case 'tiktok':
      return 'Video / Photo Mode';
    case 'x':
      return 'Up to 4 images or 1 video';
    case 'linkedin':
      return 'Image / Video / Document';
    case 'youtube':
      return 'Video';
    case 'pinterest':
      return 'Image / Video';
    default:
      return '';
  }
};
