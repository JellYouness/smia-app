import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0A2540',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Background Abstract Shapes */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,225,255,0.15) 0%, rgba(10,37,64,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,225,255,0.1) 0%, rgba(10,37,64,0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '3rem', md: '5rem' },
              lineHeight: 1.1,
              mb: 3,
              background: 'linear-gradient(to right, #FFFFFF, #00E1FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            SMIACT — Là où le digital devient action.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: '#EDEDED',
              maxWidth: '800px',
              mx: 'auto',
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Une plateforme SaaS qui connecte journalistes, développeurs, créateurs de contenu et
            entreprises autour d’un même écosystème. Publiez un besoin, recevez des pitchs, lancez
            le projet.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              href="#beta"
              sx={{
                bgcolor: '#00E1FF',
                color: '#0A2540',
                fontWeight: 700,
                px: 5,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 0 20px rgba(0, 225, 255, 0.4)',
                '&:hover': {
                  bgcolor: '#ffffff',
                  boxShadow: '0 0 30px rgba(0, 225, 255, 0.6)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Rejoindre la Beta
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="#demo"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 5,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'none',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: '#00E1FF',
                  bgcolor: 'rgba(0, 225, 255, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Poster un besoin (Démo)
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
