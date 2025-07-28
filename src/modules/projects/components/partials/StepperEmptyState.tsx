import { Box, Typography, Card, CardContent, Button, useTheme, keyframes } from '@mui/material';
import { ReactNode } from 'react';

interface StepperEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  onButtonClick?: () => void;
  showButton?: boolean;
}

// Define the pulse animation using keyframes
const pulseAnimation = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.6;
  }
`;

const StepperEmptyState = ({
  icon,
  title,
  description,
  buttonText,
  buttonIcon,
  onButtonClick,
  showButton = true,
}: StepperEmptyStateProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 1,
        border: `1px dashed ${theme.palette.divider}`,
        bgcolor: 'transparent',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      {/* Subtle background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 20%, ${theme.palette.primary.main}08 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1, py: 6, px: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          {/* Icon with animated background */}
          <Box
            sx={{
              position: 'relative',
              mb: 3,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                animation: `${pulseAnimation} 2s ease-in-out infinite`,
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
              }}
            >
              <Box
                sx={{
                  fontSize: 40,
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </Box>
            </Box>
          </Box>

          {/* Main heading */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 600,
              lineHeight: 1.6,
              fontSize: '1.05rem',
            }}
          >
            {description}
          </Typography>

          {/* Action button */}
          {showButton && buttonText && onButtonClick && (
            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
              <Button
                variant="contained"
                startIcon={buttonIcon}
                onClick={onButtonClick}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: theme.palette.primary.main,
                  '&:hover': {
                    background: theme.palette.primary.dark,
                  },
                }}
              >
                {buttonText}
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepperEmptyState;
