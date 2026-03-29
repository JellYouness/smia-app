import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Publier un brief',
    description: 'Décrivez votre besoin en quelques lignes.',
  },
  {
    num: '02',
    title: 'Recevoir des pitchs',
    description: 'Comparez les propositions et sélectionnez le bon talent.',
  },
  {
    num: '03',
    title: 'Lancer & suivre',
    description: 'Validez, payez, suivez la progression et l’impact.',
  },
];

const HowItWorksSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: '#081D33',
        color: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textAlign: 'center',
            mb: 10,
            letterSpacing: '-0.02em',
          }}
        >
          Trois étapes simples pour <span style={{ color: '#00E1FF' }}>collaborer</span>.
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
            justifyContent: 'space-between',
          }}
        >
          {/* Background Line for Dashboard (Desktop) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: '40px',
              left: '10%',
              right: '10%',
              height: '2px',
              background:
                'linear-gradient(90deg, rgba(0,225,255,0.1) 0%, rgba(0,225,255,0.5) 50%, rgba(0,225,255,0.1) 100%)',
              zIndex: 0,
            }}
          />

          {steps.map((step, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              sx={{
                flex: 1,
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
              }}
            >
              <Box
                component={motion.div}
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0,225,255,0.4)' }}
                sx={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  bgcolor: '#0A2540',
                  border: '2px solid #00E1FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 0 20px rgba(0,225,255,0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#00E1FF',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {step.num}
                </Typography>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '1.5rem',
                }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#EDEDED',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                }}
              >
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
