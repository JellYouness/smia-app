export type Platform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'youtube'
  | 'pinterest';

export type PostFormat =
  | 'image_post'
  | 'carousel'
  | 'video_post'
  | 'reel_short'
  | 'linkedin_document'
  | 'tiktok_photo_mode'
  | 'pin';

export type ChannelId = string;

export type Channel = {
  id: ChannelId;
  platform: Platform;
  name: string;
  tokenStatus: 'ok' | 'expired';
};

export type ApprovedAsset = {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'pdf';
  width?: number;
  height?: number;
  durationSec?: number;
  name: string;
  url: string;
  tags?: string[];
};

export type Variant = {
  id: string;
  originalId: string;
  kind: 'image' | 'video' | 'audio' | 'pdf';
  width?: number;
  height?: number;
  durationSec?: number;
  name: string;
  url: string;
  transformation: string;
};

export type DistributeResult = {
  channels: ChannelId[];
  format: PostFormat;
  files: string[];
  variants: Variant[];
  caption: string;
  perPlatform?: Record<
    Platform,
    {
      overrideCaption?: string;
      altText?: string;
      coverUrl?: string;
      hashtags?: string[];
      firstComment?: string;
      categoryId?: string;
    }
  >;
};

export interface DistributeModalProps {
  open: boolean;
  onClose: () => void;
  approvedAssets: ApprovedAsset[];
  onSubmit: (payload: DistributeResult) => void;
}
