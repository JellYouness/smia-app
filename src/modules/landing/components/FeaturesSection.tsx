import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Pitching intelligent',
    description: 'Les prestataires envoient des propositions structurées avec budget et délai.',
    gradient: 'linear-gradient(135deg, rgba(0,225,255,0.1) 0%, rgba(10,37,64,0) 100%)',
    borderColor: 'rgba(0, 225, 255, 0.3)',
  },
  {
    title: 'Suivi médiatique',
    description: 'Les entreprises suivent l’impact digital et la visibilité de leurs projets.',
    gradient: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(10,37,64,0) 100%)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  {
    title: 'Marketplace digitale',
    description:
      'Tous les services du digital en un seul endroit : design, développement, contenu, IA, marketing.',
    gradient: 'linear-gradient(135deg, rgba(0,225,255,0.15) 0%, rgba(10,37,64,0) 100%)',
    borderColor: 'rgba(0, 225, 255, 0.4)',
  },
];

const FeaturesSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: '#0A2540',
        color: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    height: '100%',
                    p: 5,
                    borderRadius: '24px',
                    background: feature.gradient,
                    border: `1px solid ${feature.borderColor}`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: `0 20px 40px rgba(0, 225, 255, 0.15)`,
                      borderColor: '#00E1FF',
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.8rem',
                      letterSpacing: '-0.01em',
                      color: index % 2 === 0 ? '#00E1FF' : '#FFFFFF',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#EDEDED',
                      lineHeight: 1.6,
                      fontSize: '1.1rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
