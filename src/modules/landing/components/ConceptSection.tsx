import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ConceptSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: '#081D33', // Slightly darker than #0A2540 for contrast
        color: '#FFFFFF',
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textAlign: 'center',
              mb: 4,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            Une nouvelle façon de <span style={{ color: '#00E1FF' }}>collaborer</span> dans le
            digital.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              lineHeight: 1.8,
              color: '#EDEDED',
              textAlign: 'center',
              fontWeight: 300,
            }}
          >
            SMIACT est la passerelle entre les entreprises et les talents numériques.
            <br />
            <br />
            Fini les recherches interminables : SMIACT automatise la mise en relation, le pitching
            et le suivi des projets digitaux dans un espace unique et transparent.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ConceptSection;
