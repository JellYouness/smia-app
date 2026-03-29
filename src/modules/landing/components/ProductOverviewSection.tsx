import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ProductOverviewSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: '#0A2540',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Neo Glow Background */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,225,255,0.1) 0%, rgba(10,37,64,0) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textAlign: 'center',
            mb: 3,
            letterSpacing: '-0.02em',
          }}
        >
          Un aperçu du <span style={{ color: '#00E1FF' }}>futur</span> du digital.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            maxWidth: '800px',
            mx: 'auto',
            mb: 8,
            color: '#EDEDED',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Découvrez le tableau de bord SMIACT : un espace clair et intuitif pour gérer vos briefs,
          vos pitchs, vos projets et votre visibilité médiatique.
        </Typography>

        {/* Dashboard Mockup Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Box
            sx={{
              width: '100%',
              height: { xs: '300px', md: '600px' },
              borderRadius: '24px',
              border: '1px solid rgba(0, 225, 255, 0.2)',
              background: 'linear-gradient(180deg, rgba(8, 29, 51, 0.9) 0%, #0A2540 100%)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,225,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Fake Dashboard Header */}
            <Box
              sx={{
                height: '60px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                px: 3,
                gap: 2,
              }}
            >
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F56' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27C93F' }} />
            </Box>

            {/* Fake Dashboard Body */}
            <Box sx={{ flex: 1, p: 4, display: 'flex', gap: 4 }}>
              {/* Fake Sidebar */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  gap: 2,
                  width: '200px',
                }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Box
                      sx={{
                        height: '20px',
                        width: i === 1 ? '100%' : '80%',
                        borderRadius: '4px',
                        background: i === 1 ? 'rgba(0,225,255,0.2)' : 'rgba(255,255,255,0.05)',
                      }}
                    />
                  </motion.div>
                ))}
              </Box>

              {/* Fake Content Area */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={`card-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      style={{ flex: 1 }}
                    >
                      <Box
                        sx={{
                          height: '100px',
                          borderRadius: '16px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: '200px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  />
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProductOverviewSection;
