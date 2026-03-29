import React, { useState } from 'react';
import { Box, Container, Typography, Tab, Tabs } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const audienceData = [
  {
    id: 'entreprises',
    title: 'Entreprises',
    content: 'Trouvez rapidement des talents fiables, suivez vos projets, payez en toute sécurité.',
    color: '#00E1FF',
  },
  {
    id: 'talents',
    title: 'Acteurs du digital',
    content:
      'Gagnez en visibilité, décrochez des missions qualifiées et collaborez avec des marques.',
    color: '#FFFFFF',
  },
];

const TargetAudienceSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: '#081D33',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textAlign: 'center',
            mb: 6,
            letterSpacing: '-0.02em',
          }}
        >
          Pour <span style={{ color: '#00E1FF' }}>qui</span> ?
        </Typography>

        <Box sx={{ width: '100%', mb: 6, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#00E1FF',
                height: 3,
                borderRadius: '3px',
              },
            }}
          >
            {audienceData.map((item, index) => (
              <Tab
                key={item.id}
                label={item.title}
                sx={{
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  textTransform: 'none',
                  color: activeTab === index ? '#00E1FF' : 'rgba(255,255,255,0.6)',
                  px: 4,
                  transition: 'color 0.3s',
                  '&.Mui-selected': {
                    color: '#00E1FF',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative', minHeight: '150px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: '100%' }}
            >
              <Box
                sx={{
                  p: 5,
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(0,225,255,0.2)`,
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    lineHeight: 1.6,
                    color: '#EDEDED',
                  }}
                >
                  {audienceData[activeTab].content}
                </Typography>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
};

export default TargetAudienceSection;
