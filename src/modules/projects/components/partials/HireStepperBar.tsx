import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type StepKey = 'invite' | 'review' | 'hire' | 'kickoff';

interface HireStepperBarProps {
  active: StepKey;
  proposalsCount?: number;
  hiresCount?: number;
  onStepChange?: (step: StepKey) => void;
}

type StepStatus = 'active' | 'default';

interface StepItemProps {
  status: StepStatus;
  last: boolean;
  clickable: boolean;
}

const StepItem = styled('li', {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'last' && prop !== 'clickable',
})<StepItemProps>(({ theme, status, last, clickable }) => {
  const primary = theme.palette.primary.main;
  const bg = status === 'active' ? primary : theme.palette.background.paper;

  return {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    userSelect: 'none',
    cursor: clickable ? 'pointer' : 'default',
    backgroundColor: bg,
    color: status === 'active' ? theme.palette.common.white : theme.palette.text.primary,
    border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
    borderLeftWidth: 1,
    '&:first-of-type': {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    '&:last-of-type': {
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    '&:hover': {
      border: `2px solid ${primary}`,
      color: status === 'active' ? theme.palette.common.white : primary,
      '&::after': {
        boxShadow: `3px -3px ${primary}`,
      },
    },
    '&::after': last
      ? {}
      : {
          content: '""',
          position: 'absolute',
          top: '58%',
          right: -22,
          width: 44,
          height: 44,
          marginTop: -25,
          background: bg,
          transform: 'scale(0.7071) rotate(45deg)',
          boxShadow: `2px -2px black`,
          zIndex: 1,
        },
  };
});

const HireStepperBar = ({
  active,
  proposalsCount = 0,
  hiresCount = 0,
  onStepChange,
}: HireStepperBarProps) => {
  const { t } = useTranslation(['project']);

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const primary = theme.palette.primary.main;

  const steps: { key: StepKey; label: string; count?: number }[] = [
    { key: 'invite', label: t('project:invite_creators') },
    { key: 'review', label: t('project:proposals'), count: proposalsCount },
    { key: 'hire', label: t('project:hire'), count: hiresCount },
    { key: 'kickoff', label: t('project:kickoff', 'Kick-off') },
  ];

  const activeIdx = steps.findIndex((s) => s.key === active);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <Box component="nav" aria-label="Hire flow steps" sx={{ overflow: 'hidden' }}>
      <Box component="ol" sx={{ display: 'flex', p: 0, m: 0, alignItems: 'stretch' }}>
        {steps.map((step, idx) => {
          const status: StepStatus = idx === activeIdx ? 'active' : 'default';

          const isPrevActive = idx === activeIdx - 1;
          const isActiveStep = idx === activeIdx;
          const arrowHighlightedOnHover = idx === hoveredIdx || idx === (hoveredIdx ?? -1) - 1;

          return (
            <StepItem
              key={step.key}
              status={status}
              last={idx === steps.length - 1}
              clickable={!!onStepChange}
              onClick={() => onStepChange?.(step.key)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              sx={{
                fontSize: smDown ? 12 : 14,
                py: smDown ? 1 : 1.5,

                ...(isPrevActive && {
                  '&::after': {
                    boxShadow: `2px -2px ${primary}`,
                  },
                }),

                ...(isActiveStep && {
                  '&::after': { boxShadow: `2px -2px ${primary}` },
                }),

                ...(arrowHighlightedOnHover && {
                  '&::after': {
                    boxShadow: `3px -3px ${primary}`,
                  },
                }),
              }}
            >
              <Typography component="span" sx={{ fontSize: smDown ? 10 : 12, fontWeight: 600 }}>
                {step.label.toUpperCase()}
                {step.count !== undefined && ` (${step.count})`}
              </Typography>
            </StepItem>
          );
        })}
      </Box>
    </Box>
  );
};

export default HireStepperBar;
