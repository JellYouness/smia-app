import React, { useState, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  FormHelperText,
  SxProps,
  Theme,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';

interface RHFProfilePictureProps {
  name: string;
  label?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
  maxSize?: number; // in MB
  accept?: string;
}

const RHFProfilePicture = ({
  name,
  label,
  helperText,
  sx,
  maxSize = 5, // 5MB default
  accept = 'image/*',
}: RHFProfilePictureProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation(['common', 'user']);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(t('common:file_size_error', { maxSize }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('user:invalid_image_format'));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setValue(name, file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setValue(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ width: '100%', ...sx }}>
          {label && (
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {label}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={preview || undefined}
              sx={{
                width: 80,
                height: 80,
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={handleClick}
            >
              {!preview && <PhotoCamera />}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                onClick={handleClick}
                sx={{ mb: 1 }}
              >
                {t('user:upload_profile_picture')}
              </Button>

              {preview && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleRemove}
                  size="small"
                >
                  {t('common:remove')}
                </Button>
              )}

              <Typography variant="caption" color="text.secondary" display="block">
                {t('user:profile_picture_help')} ({t('common:max_file_size')}: {maxSize}MB)
              </Typography>
            </Box>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {(helperText || errors[name]) && (
            <FormHelperText error={!!errors[name]}>
              {(errors[name]?.message as string) || helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default RHFProfilePicture;
