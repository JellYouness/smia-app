import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';

const CallToActionSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to Laravel backend: /api/leads
    console.log('Submitting to /api/leads:', formData);
    alert('Merci de votre intérêt ! Vous serez recontacté prochainement.');
    setFormData({ name: '', email: '', role: '' });
  };

  return (
    <Box
      id="beta"
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: '#0A2540',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,225,255,0.1) 0%, rgba(10,37,64,0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <Box
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '32px',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,225,255,0.05) 100%)',
              border: '1px solid rgba(0, 225, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Prêt à transformer un besoin en <span style={{ color: '#00E1FF' }}>projet</span> ?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                mb: 6,
                color: '#EDEDED',
                lineHeight: 1.6,
              }}
            >
              Rejoignez la Beta SMIACT dès maintenant — que vous soyez une entreprise ou un créatif.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                <TextField
                  fullWidth
                  name="name"
                  label="Nom complet"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#FFF',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00E1FF' },
                      '&.Mui-focused fieldset': { borderColor: '#00E1FF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00E1FF' },
                  }}
                />

                <TextField
                  fullWidth
                  name="email"
                  label="Email professionnel"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#FFF',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00E1FF' },
                      '&.Mui-focused fieldset': { borderColor: '#00E1FF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00E1FF' },
                  }}
                />

                <FormControl
                  fullWidth
                  required
                  sx={{
                    textAlign: 'left',
                    '& .MuiOutlinedInput-root': {
                      color: '#FFF',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00E1FF' },
                      '&.Mui-focused fieldset': { borderColor: '#00E1FF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00E1FF' },
                    '& .MuiSelect-icon': { color: '#FFF' },
                  }}
                >
                  <InputLabel id="role-label">Je suis...</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    label="Je suis..."
                    value={formData.role}
                    // @ts-ignore
                    onChange={handleChange}
                  >
                    <MenuItem value="entreprise">Une entreprise</MenuItem>
                    <MenuItem value="talent">Un acteur du digital (Talent)</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    bgcolor: '#00E1FF',
                    color: '#0A2540',
                    fontWeight: 700,
                    px: 5,
                    py: 2,
                    borderRadius: '50px',
                    fontSize: '1.2rem',
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
              </Box>
            </form>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CallToActionSection;
