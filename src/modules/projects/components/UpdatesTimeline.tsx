import { Box, Typography, Chip, Stack, Skeleton, useTheme, Paper, Divider } from '@mui/material';
import { ProjectUpdate, PROJECT_UPDATE_TYPE } from '../defs/types';
import dayjs from 'dayjs';
import { FiberManualRecord, Report, Update } from '@mui/icons-material';

interface Props {
  updates: ProjectUpdate[];
  loading?: boolean;
}

const updateTypeConfig = {
  [PROJECT_UPDATE_TYPE.UPDATE]: {
    color: 'primary',
    icon: <Update fontSize="small" />,
    label: 'Update',
  },
  [PROJECT_UPDATE_TYPE.REPORT_REQUEST]: {
    color: 'warning',
    icon: <Report fontSize="small" />,
    label: 'Report Request',
  },
};

const UpdatesTimeline = ({ updates, loading }: Props) => {
  const theme = useTheme();

  const getPaletteColor = (color: string) => {
    const palette = theme.palette[color as keyof typeof theme.palette];
    if (typeof palette === 'object' && palette && 'main' in palette) {
      return String(palette.main);
    }
    if (typeof palette === 'string') {
      return palette;
    }
    return '';
  };

  if (loading) {
    return (
      <Stack spacing={3} sx={{ px: 1 }}>
        {[1, 2].map((i) => (
          <Box key={i} display="flex">
            <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="rectangular" width={2} height="100%" sx={{ mt: 0.5 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Skeleton width={160} height={20} sx={{ mb: 1 }} />
              <Skeleton width="30%" height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        ))}
      </Stack>
    );
  }

  if (!updates.length) {
    return (
      <Box
        textAlign="center"
        p={4}
        sx={{
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No updates recorded yet
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Project updates will appear here
        </Typography>
      </Box>
    );
  }

  // Sort with newest first
  const sorted = [...updates].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

  return (
    <Box sx={{ position: 'relative', pl: 2 }}>
      {/* Vertical timeline */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 26,
          width: 2,
          bgcolor: theme.palette.divider,
          zIndex: 1,
        }}
      />

      <Stack spacing={3}>
        {sorted.map((update, index) => {
          const config = updateTypeConfig[update.type];

          return (
            <Box key={update.id} sx={{ display: 'flex', position: 'relative', zIndex: 2 }}>
              {/* Timeline dot */}
              <Box
                sx={{
                  mr: 3,
                  mt: 0.5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: theme.palette.background.paper,
                  border: `2px solid ${getPaletteColor(config.color)}`,
                }}
              >
                <FiberManualRecord
                  fontSize="small"
                  style={{
                    color: getPaletteColor(config.color),
                    fontSize: '0.75rem',
                  }}
                />
              </Box>

              {/* Update card */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 2.5,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: theme.shadows[1],
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(update.createdAt).format('MMM D, YYYY [at] h:mm A')}
                  </Typography>

                  <Chip
                    icon={config.icon}
                    label={config.label}
                    size="small"
                    color={config.color as any}
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1,
                      borderWidth: 1.5,
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    mt: 1.5,
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                  }}
                >
                  {update.body}
                </Typography>
              </Paper>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default UpdatesTimeline;
