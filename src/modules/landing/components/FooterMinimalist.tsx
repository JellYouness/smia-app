import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const FooterMinimalist = () => {
  return (
    <Box
      sx={{
        py: 6,
        bgcolor: '#05121D', // Very dark blue/black
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Logo Placeholder (Replace with actual text/image if preferred) */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.05em',
              background: 'linear-gradient(to right, #FFFFFF, #00E1FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SMIACT
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 300,
              fontSize: '0.9rem',
            }}
          >
            &copy; {new Date().getFullYear()} SMIACT — Là où le digital se fait.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterMinimalist;
