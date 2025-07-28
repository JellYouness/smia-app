import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface GradientButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  variant?: 'gradient' | ButtonProps['variant'];
  color?: 'primary' | 'success' | 'error' | ButtonProps['color'];
}

const StyledGradientButton = styled(Button)<GradientButtonProps>(({ theme, variant, color }) => ({
  ...(variant === 'gradient' && {
    fontWeight: 600,
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      background: '#e2e8f0',
      color: '#94a3b8',
      boxShadow: 'none',
      transform: 'none',
    },
    ...(color === 'primary' && {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      color: '#ffffff',
      '&:hover': {
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
        transform: 'translateY(-1px)',
      },
    }),
    ...(color === 'success' && {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      color: '#ffffff',
      '&:hover': {
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
        transform: 'translateY(-1px)',
      },
    }),
    ...(color === 'error' && {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
      color: '#ffffff',
      '&:hover': {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
        transform: 'translateY(-1px)',
      },
    }),
  }),
}));

const GradientButton: React.FC<GradientButtonProps> = ({
  variant,
  color = 'primary',
  ...props
}) => {
  return <StyledGradientButton variant={variant} color={color} {...props} />;
};

export default GradientButton;
