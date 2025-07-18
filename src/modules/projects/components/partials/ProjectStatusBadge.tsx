import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ProjectStatusBadgeProps {
  status: string;
}

const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const { t } = useTranslation(['project']);
  const theme = useTheme();

  const statusConfig = {
    draft: {
      label: t('project:draft'),
      color: theme.palette.grey[500],
      bgColor: theme.palette.grey[100],
    },
    in_progress: {
      label: t('project:in_progress'),
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light,
    },
    completed: {
      label: t('project:completed'),
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: theme.palette.grey[500],
    bgColor: theme.palette.grey[100],
  };

  return (
    <Box
      component="span"
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: config.bgColor,
        color: config.color,
        textTransform: 'uppercase',
      }}
    >
      {config.label}
    </Box>
  );
};

export default ProjectStatusBadge;
