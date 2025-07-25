import React, { useState, useRef } from 'react';
import { Box, Avatar, Badge, Stack, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ProfilePictureProps {
  src: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  editable?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, onUpload, onDelete, editable }) => {
  const { t } = useTranslation(['common', 'user']);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      // eslint-disable-next-line no-alert
      alert(t('user:invalid_image_format'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // eslint-disable-next-line no-alert
      alert(t('user:image_size_limit'));
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error(t('user:image_upload_error'), error);
      // eslint-disable-next-line no-alert
      alert(t('user:image_upload_error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 2 }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Stack direction="row" spacing={0.5}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {editable && (
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 32,
                  height: 32,
                }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            {src && editable && (
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                  width: 32,
                  height: 32,
                }}
                onClick={onDelete}
                disabled={isUploading}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Stack>
        }
      >
        <Avatar
          src={src || undefined}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        />
      </Badge>
    </Box>
  );
};

export default ProfilePicture;
