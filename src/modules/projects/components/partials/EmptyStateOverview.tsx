import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
      sx={{
        background: 'linear-gradient(to bottom, #f9fbfd 0%, #ffffff 100%)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        {icon}
      </Box>

      <Typography variant="h6" fontWeight={500} gutterBottom>
        {title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={3}
        sx={{
          lineHeight: 1.6,
          maxWidth: 500,
        }}
      >
        {description}
      </Typography>

      {action}
    </Box>
  );
};

export default EmptyState;
