import { Avatar, AvatarProps } from '@mui/material';
import { useState } from 'react';
import Utils from '@common/defs/utils';

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'alt'> {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    color?: string;
    profile?: {
      profilePicture?: string;
    };
  };
  size?: 'small' | 'medium' | 'large';
  showInitials?: boolean;
  width?: number;
  height?: number;
}

// Calculate font size based on avatar dimensions
const calculateFontSize = (width: number, height: number): number => {
  // Use the smaller dimension to ensure text fits
  const minDimension = Math.min(width, height);

  // Font size should be roughly 40-50% of the avatar size for good readability
  // For very small avatars, use a minimum font size of 10px
  const calculatedSize = Math.max(minDimension * 0.38, 10);

  // For larger avatars, cap the font size to maintain proportions
  const maxSize = Math.min(calculatedSize, minDimension * 0.6);

  return Math.round(maxSize);
};

const UserAvatar = ({
  user,
  size = 'medium',
  showInitials = true,
  width,
  height,
  sx,
  ...props
}: UserAvatarProps) => {
  const sizeMap = {
    small: { width: 24, height: 24, fontSize: 12 },
    medium: { width: 32, height: 32, fontSize: 14 },
    large: { width: 40, height: 40, fontSize: 16 },
  };

  const [imageError, setImageError] = useState(false);
  const profilePicture = user.profile?.profilePicture;
  const hasProfilePicture = profilePicture && !imageError;
  const initials = Utils.getUserInitials(user.firstName, user.lastName, user.email);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
  };

  // Use custom width/height if provided, otherwise use size map
  const avatarWidth = width || sizeMap[size].width;
  const avatarHeight = height || sizeMap[size].height;

  // Calculate font size based on dimensions
  const fontSize =
    width && height ? calculateFontSize(avatarWidth, avatarHeight) : sizeMap[size].fontSize;

  const avatarStyles = {
    width: avatarWidth,
    height: avatarHeight,
    fontSize,
  };

  return (
    <Avatar
      src={hasProfilePicture ? profilePicture : undefined}
      alt={user.firstName || user.email}
      sx={{
        ...avatarStyles,
        backgroundColor: user.color,
        ...sx,
      }}
      imgProps={{
        onError: handleImageError,
      }}
      {...props}
    >
      {!hasProfilePicture && showInitials && initials}
    </Avatar>
  );
};

export default UserAvatar;
