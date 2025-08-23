import React, { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Error,
  Image as ImageIcon,
  VideoFile,
  AudioFile,
  PictureAsPdf,
  Close,
  Instagram,
  Facebook,
  LinkedIn,
  YouTube,
  Pinterest,
} from '@mui/icons-material';
import XIcon from './XIcon';
import TikTokIcon from './TikTokIcon';

import {
  DistributeModalProps,
  ApprovedAsset,
  Channel,
  PostFormat,
  Platform,
  ChannelId,
  DistributeResult,
  Variant,
} from './types';
import { CONNECTED_CHANNELS, getPlatformLabel, getPlatformCapabilitiesText } from './fakeData';
import { CAPABILITIES, getFormatIntersection, isFormatCompatibleWithAssets } from './capabilities';
import {
  trimToMaxImages,
  packIntoCarousel,
  makeVerticalVideo,
  wrapAudioToMp4,
  pdfToLinkedInDocument,
  padOrCropToRatio,
  getAssetRatio,
  formatDuration,
  createVariantFromAsset,
} from './variantEngine';

const DistributeModal = ({ open, onClose, approvedAssets, onSubmit }: DistributeModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<PostFormat | ''>('');
  const [selectedAssets, setSelectedAssets] = useState<ApprovedAsset[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [caption, setCaption] = useState('');
  const [customizePerPlatform, setCustomizePerPlatform] = useState(false);
  const [platformSettings, setPlatformSettings] = useState<Record<Platform, any>>(
    {} as Record<Platform, any>
  );

  const channels = useMemo(() => CONNECTED_CHANNELS, []);
  const selectedPlatforms = useMemo(
    () => channels.filter((c) => selectedChannels.includes(c.id)).map((c) => c.platform),
    [selectedChannels, channels]
  );

  const availableFormats = useMemo(
    () => getFormatIntersection(selectedPlatforms),
    [selectedPlatforms]
  );

  const formatCompatibility = useMemo(() => {
    if (!selectedFormat) {
      return { compatible: true, reasons: [] };
    }
    return isFormatCompatibleWithAssets(selectedFormat, selectedAssets, selectedPlatforms);
  }, [selectedFormat, selectedAssets, selectedPlatforms]);

  const handleChannelToggle = useCallback((channelId: ChannelId) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  }, []);

  const handleAssetToggle = useCallback((asset: ApprovedAsset) => {
    setSelectedAssets((prev) =>
      prev.find((a) => a.id === asset.id) ? prev.filter((a) => a.id !== asset.id) : [...prev, asset]
    );
  }, []);

  const handleFixAction = useCallback(
    (action: string, assets?: ApprovedAsset[]) => {
      const assetsToFix = assets || selectedAssets;

      switch (action) {
        case 'trim_to_4':
          setSelectedAssets(trimToMaxImages(assetsToFix, 4));
          break;
        case 'pack_carousel':
          setSelectedFormat('carousel');
          break;
        case 'make_vertical': {
          const verticalAssets = assetsToFix.map(makeVerticalVideo);
          setSelectedAssets(verticalAssets);
          const verticalVariants = verticalAssets.map((a) => createVariantFromAsset(a, 'vertical'));
          setVariants((prev) => [...prev, ...verticalVariants]);
          break;
        }
        case 'wrap_audio': {
          const wrappedAssets = assetsToFix.map((asset) => wrapAudioToMp4(asset));
          setSelectedAssets(wrappedAssets);
          const wrappedVariants = wrappedAssets.map((a) => createVariantFromAsset(a, 'audiogram'));
          setVariants((prev) => [...prev, ...wrappedVariants]);
          break;
        }
        case 'pdf_to_doc': {
          const docAssets = assetsToFix.map(pdfToLinkedInDocument);
          setSelectedAssets(docAssets);
          const docVariants = docAssets.map((a) => createVariantFromAsset(a, 'linkedin_doc'));
          setVariants((prev) => [...prev, ...docVariants]);
          break;
        }
        case 'ratio_1_1':
        case 'ratio_4_5':
        case 'ratio_9_16':
        case 'ratio_16_9': {
          const ratio = action.replace('ratio_', '').replace('_', ':') as
            | '1:1'
            | '4:5'
            | '9:16'
            | '16:9';
          const ratiodAssets = assetsToFix.map((a) => padOrCropToRatio(a, ratio));
          setSelectedAssets(ratiodAssets);
          const ratioVariants = ratiodAssets.map((a) =>
            createVariantFromAsset(a, `ratio_${ratio}`)
          );
          setVariants((prev) => [...prev, ...ratioVariants]);
          break;
        }
        default:
          break;
      }
    },
    [selectedAssets]
  );

  const getAssetIcon = (kind: string) => {
    switch (kind) {
      case 'image':
        return <ImageIcon />;
      case 'video':
        return <VideoFile />;
      case 'audio':
        return <AudioFile />;
      case 'pdf':
        return <PictureAsPdf />;
      default:
        return <ImageIcon />;
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0:
        return selectedChannels.length > 0;
      case 1:
        return selectedFormat !== '' && formatCompatibility.compatible && selectedAssets.length > 0;
      case 2:
        return caption.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = () => {
    const result: DistributeResult = {
      channels: selectedChannels,
      format: selectedFormat as PostFormat,
      files: selectedAssets.map((a) => a.id),
      variants,
      caption,
      perPlatform: customizePerPlatform ? platformSettings : undefined,
    };

    console.log('Distribute payload:', result);
    onSubmit(result);
    onClose();
  };

  const formatName = (format: PostFormat): string => {
    const names: Record<PostFormat, string> = {
      image_post: 'Image Post',
      carousel: 'Carousel',
      video_post: 'Video Post',
      reel_short: 'Reel/Short',
      linkedin_document: 'LinkedIn Document',
      tiktok_photo_mode: 'TikTok Photo Mode',
      pin: 'Pin',
    };
    return names[format];
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram sx={{ width: '67px', height: '67px' }} />;
      case 'facebook':
        return <Facebook sx={{ width: '67px', height: '67px' }} />;
      case 'tiktok':
        return <TikTokIcon />;
      case 'x':
        return <XIcon />;
      case 'linkedin':
        return <LinkedIn sx={{ width: '67px', height: '67px' }} />;
      case 'youtube':
        return <YouTube sx={{ width: '67px', height: '67px' }} />;
      case 'pinterest':
        return <Pinterest sx={{ width: '67px', height: '67px' }} />;
      default:
        return <ImageIcon sx={{ width: '67px', height: '67px' }} />;
    }
  };

  const getPlatformColor = (platform: Platform): string => {
    switch (platform) {
      case 'instagram':
        return '#E4405F';
      case 'facebook':
        return '#1877F2';
      case 'tiktok':
        return '#000000';
      case 'x':
        return '#000000';
      case 'linkedin':
        return '#0A66C2';
      case 'youtube':
        return '#FF0000';
      case 'pinterest':
        return '#BD081C';
      default:
        return '#666666';
    }
  };

  const resetModal = () => {
    setActiveStep(0);
    setSelectedChannels([]);
    setSelectedFormat('');
    setSelectedAssets([]);
    setVariants([]);
    setCaption('');
    setCustomizePerPlatform(false);
    setPlatformSettings({} as Record<Platform, any>);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '90vh', maxHeight: '90vh' },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h5" fontWeight={600}>
              Distribute Content
            </Typography>
            <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 1 }}>
              <Close />
            </Button>
          </Box>

          <Stepper activeStep={activeStep} orientation="horizontal">
            {['Channels', 'Format & Files', 'Details', 'Review'].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Channels
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose which channels to publish to
              </Typography>

              {selectedChannels.length > 0 && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: 'primary.main',
                    borderRadius: '12px',
                    color: 'white',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''}{' '}
                    selected
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {channels
                      .filter((c) => selectedChannels.includes(c.id))
                      .map((c) => c.name)
                      .join(', ')}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {channels.map((channel) => (
                  <Card
                    key={channel.id}
                    sx={{
                      border: selectedChannels.includes(channel.id)
                        ? `2px solid ${getPlatformColor(channel.platform)}`
                        : '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: getPlatformColor(channel.platform),
                        boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                        transform: 'translateY(-1px)',
                      },
                      backgroundColor: selectedChannels.includes(channel.id)
                        ? `${getPlatformColor(channel.platform)}08`
                        : 'white',
                    }}
                    onClick={() => handleChannelToggle(channel.id)}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Checkbox
                            checked={selectedChannels.includes(channel.id)}
                            sx={{
                              color: getPlatformColor(channel.platform),
                              '&.Mui-checked': {
                                color: getPlatformColor(channel.platform),
                              },
                            }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: getPlatformColor(channel.platform),
                              fontSize: '32px',
                            }}
                          >
                            {getPlatformIcon(channel.platform)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {getPlatformLabel(channel.platform)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {channel.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                size="small"
                                label={getPlatformCapabilitiesText(channel.platform)}
                                variant="outlined"
                                sx={{
                                  fontSize: '0.7rem',
                                  borderColor: getPlatformColor(channel.platform),
                                  color: getPlatformColor(channel.platform),
                                  backgroundColor: `${getPlatformColor(channel.platform)}08`,
                                }}
                              />
                              {channel.tokenStatus !== 'ok' && (
                                <Chip
                                  size="small"
                                  label="Fix"
                                  color="warning"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {selectedChannels.includes(channel.id) && (
                            <CheckCircle
                              sx={{
                                color: getPlatformColor(channel.platform),
                                fontSize: 20,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Format & Files
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Post Format</InputLabel>
                  <Select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as PostFormat)}
                    label="Post Format"
                  >
                    {availableFormats.map((format: PostFormat) => (
                      <MenuItem key={format} value={format}>
                        {formatName(format)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {!formatCompatibility.compatible && (
                  <Box sx={{ mb: 2 }}>
                    {formatCompatibility.reasons.map((reason: string, idx: number) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Error color="error" fontSize="small" />
                        <Typography variant="body2" color="error">
                          {reason}
                        </Typography>
                        {reason.includes('Too many images') && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleFixAction('trim_to_4')}
                          >
                            Trim to 4 photos
                          </Button>
                        )}
                      </Box>
                    ))}

                    {selectedAssets.filter((a) => a.kind === 'image').length >= 2 &&
                      selectedFormat !== 'carousel' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleFixAction('pack_carousel')}
                          >
                            Pack into Carousel
                          </Button>
                        </Box>
                      )}
                  </Box>
                )}
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Select Files
              </Typography>

              <Grid container spacing={2} sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {approvedAssets.map((asset) => (
                  <Grid item xs={6} md={4} key={asset.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedAssets.find((a) => a.id === asset.id)
                          ? '2px solid'
                          : '1px solid',
                        borderColor: selectedAssets.find((a) => a.id === asset.id)
                          ? 'primary.main'
                          : 'divider',
                      }}
                      onClick={() => handleAssetToggle(asset)}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: 120,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'grey.100',
                        }}
                      >
                        {asset.kind === 'image' ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          getAssetIcon(asset.kind)
                        )}
                      </CardMedia>
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="caption" noWrap>
                          {asset.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {getAssetRatio(asset) && (
                            <Chip
                              size="small"
                              label={getAssetRatio(asset)}
                              sx={{ fontSize: '0.6rem' }}
                            />
                          )}
                          {asset.durationSec && (
                            <Chip
                              size="small"
                              label={formatDuration(asset.durationSec)}
                              sx={{ fontSize: '0.6rem' }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={customizePerPlatform}
                      onChange={(e) => setCustomizePerPlatform(e.target.checked)}
                    />
                  }
                  label="Customize per platform"
                />
              </Box>

              {customizePerPlatform && (
                <Box sx={{ mb: 3 }}>
                  {selectedPlatforms.map((platform) => (
                    <Accordion key={platform}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{getPlatformLabel(platform)}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Override Caption"
                              value={platformSettings[platform]?.overrideCaption || ''}
                              onChange={(e) =>
                                setPlatformSettings((prev) => ({
                                  ...prev,
                                  [platform]: {
                                    ...prev[platform],
                                    overrideCaption: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Alt Text"
                              value={platformSettings[platform]?.altText || ''}
                              onChange={(e) =>
                                setPlatformSettings((prev) => ({
                                  ...prev,
                                  [platform]: { ...prev[platform], altText: e.target.value },
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Hashtags"
                              value={platformSettings[platform]?.hashtags?.join(' ') || ''}
                              onChange={(e) =>
                                setPlatformSettings((prev) => ({
                                  ...prev,
                                  [platform]: {
                                    ...prev[platform],
                                    hashtags: e.target.value.split(' ').filter(Boolean),
                                  },
                                }))
                              }
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review & Publish
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    {selectedChannels.length > 0 ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Error color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${selectedChannels.length} channels selected`}
                    secondary={channels
                      .filter((c) => selectedChannels.includes(c.id))
                      .map((c) => c.name)
                      .join(', ')}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {selectedAssets.length > 0 ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Error color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${selectedAssets.length} files selected`}
                    secondary={
                      selectedFormat
                        ? formatName(selectedFormat as PostFormat)
                        : 'No format selected'
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {caption.trim() ? <CheckCircle color="success" /> : <Error color="error" />}
                  </ListItemIcon>
                  <ListItemText
                    primary="Caption set"
                    secondary={caption.trim() || 'No caption provided'}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: 3,
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Selected: {selectedChannels.length} channels • {selectedAssets.length} files
            {selectedFormat && ` • ${formatName(selectedFormat as PostFormat)}`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
            {activeStep < 3 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepComplete(activeStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!isStepComplete(0) || !isStepComplete(1) || !isStepComplete(2)}
              >
                Publish to {selectedChannels.length} channels
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DistributeModal;
