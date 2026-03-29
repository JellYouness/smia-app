import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Chip,
  IconButton,
  Drawer,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#050F1C',
  bgAlt: '#081629',
  card: 'rgba(255,255,255,0.04)',
  cardHover: 'rgba(0,229,255,0.06)',
  cyan: '#00E5FF',
  cyanDim: 'rgba(0,229,255,0.10)',
  cyanBorder: 'rgba(0,229,255,0.28)',
  purple: '#7B61FF',
  purpleDim: 'rgba(123,97,255,0.10)',
  purpleBorder: 'rgba(123,97,255,0.30)',
  white: '#FFFFFF',
  muted: 'rgba(255,255,255,0.55)',
  border: 'rgba(255,255,255,0.07)',
};

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

// ─── Reusable animated section wrapper ───────────────────────────────────────
const AnimSection = ({
  children,
  id,
  bg,
  py = 12,
}: {
  children: React.ReactNode;
  id?: string;
  bg?: string;
  py?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <Box id={id} sx={{ bgcolor: bg ?? C.bg, py: { xs: 8, md: py } }}>
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          {children}
        </motion.div>
      </Container>
    </Box>
  );
};

// ─── Section label ────────────────────────────────────────────────────────────
const Label = ({ children }: { children: string }) => (
  <motion.div variants={fadeUp}>
    <Typography
      sx={{
        color: C.cyan,
        fontWeight: 700,
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: 3.5,
        textAlign: 'center',
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  </motion.div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const Heading = ({
  line1,
  gradient,
  line2 = '',
}: {
  line1: string;
  gradient: string;
  line2?: string;
}) => (
  <motion.div variants={fadeUp}>
    <Typography
      variant="h2"
      sx={{
        color: C.white,
        fontWeight: 800,
        fontSize: { xs: '2rem', md: '2.8rem' },
        textAlign: 'center',
        letterSpacing: '-1px',
        lineHeight: 1.2,
        mb: 2,
      }}
    >
      {line1}{' '}
      <Box
        component="span"
        sx={{
          background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {gradient}
      </Box>
      {line2 && (
        <>
          <br />
          {line2}
        </>
      )}
    </Typography>
  </motion.div>
);

// ─── Sub text ─────────────────────────────────────────────────────────────────
const Sub = ({ children, maxW = 520 }: { children: string; maxW?: number }) => (
  <motion.div variants={fadeUp}>
    <Typography
      sx={{
        color: C.muted,
        textAlign: 'center',
        fontSize: '1.05rem',
        maxWidth: maxW,
        mx: 'auto',
        mb: 7,
        lineHeight: 1.75,
      }}
    >
      {children}
    </Typography>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { label: 'Fonctionnalités', id: 'features' },
    { label: 'Comment ça marche', id: 'how' },
    { label: 'Pour qui', id: 'forwho' },
  ];

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          transition: 'background 0.3s, border 0.3s',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          bgcolor: scrolled ? 'rgba(5,15,28,0.92)' : 'transparent',
          borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: 68 }}>
            {/* Logo */}
            <Typography
              onClick={() => scrollTo('hero')}
              sx={{
                fontWeight: 900,
                fontSize: '1.5rem',
                cursor: 'pointer',
                letterSpacing: '-0.5px',
                background: `linear-gradient(90deg, ${C.cyan} 0%, #fff 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SMIACT
            </Typography>

            {/* Desktop nav links */}
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {links.map((l) => (
                <Button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  sx={{
                    color: C.muted,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    px: 2,
                    '&:hover': { color: C.white },
                  }}
                >
                  {l.label}
                </Button>
              ))}
            </Stack>

            {/* CTA buttons */}
            <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => router.push(Routes.Auth.Login)}
                sx={{
                  color: C.white,
                  textTransform: 'none',
                  border: `1px solid ${C.border}`,
                  borderRadius: 2,
                  px: 2.5,
                  py: 0.9,
                  '&:hover': { borderColor: C.cyanBorder, bgcolor: C.cyanDim },
                }}
              >
                Connexion
              </Button>
              <Button
                onClick={() => scrollTo('cta')}
                sx={{
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
                  color: '#050F1C',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2.5,
                  py: 0.9,
                  '&:hover': { opacity: 0.88 },
                }}
              >
                Commencer gratuitement
              </Button>
            </Stack>

            {/* Mobile hamburger */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: C.white }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { bgcolor: '#081629', width: 280, p: 3 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1.5rem',
              background: `linear-gradient(90deg, ${C.cyan}, #fff)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SMIACT
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: C.white }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1.5}>
          {links.map((l) => (
            <Button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              sx={{ color: C.white, textTransform: 'none', justifyContent: 'flex-start', fontSize: '1rem' }}
            >
              {l.label}
            </Button>
          ))}
          <Box pt={2} sx={{ borderTop: `1px solid ${C.border}` }}>
            <Button
              fullWidth
              onClick={() => router.push(Routes.Auth.Login)}
              sx={{ color: C.white, textTransform: 'none', border: `1px solid ${C.border}`, borderRadius: 2, mb: 1.5, py: 1 }}
            >
              Connexion
            </Button>
            <Button
              fullWidth
              onClick={() => scrollTo('cta')}
              sx={{
                textTransform: 'none',
                background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
                color: '#050F1C',
                fontWeight: 700,
                borderRadius: 2,
                py: 1,
              }}
            >
              Commencer gratuitement
            </Button>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════════
const HeroSection = () => {
  const router = useRouter();

  return (
    <Box
      id="hero"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: C.bg,
        pt: { xs: 12, md: 10 },
        pb: 8,
      }}
    >
      {/* Background orb left */}
      <Box
        component={motion.div as any}
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: '5%',
          left: '-12%',
          width: { xs: 320, md: 560 },
          height: { xs: 320, md: 560 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.cyanDim} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      {/* Background orb right */}
      <Box
        component={motion.div as any}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '-8%',
          width: { xs: 300, md: 620 },
          height: { xs: 300, md: 620 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.purpleDim} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      {/* Grid lines */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Beta badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '15px !important', color: `${C.cyan} !important` }} />}
              label="Plateforme en Beta — Rejoignez les premiers utilisateurs"
              sx={{
                bgcolor: C.cyanDim,
                color: C.cyan,
                border: `1px solid ${C.cyanBorder}`,
                fontWeight: 600,
                fontSize: '0.78rem',
                mb: 4,
                height: 36,
                cursor: 'default',
              }}
            />
          </motion.div>

          {/* Main headline */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.8rem', sm: '3.6rem', md: '4.8rem' },
                lineHeight: 1.08,
                letterSpacing: { xs: '-1.5px', md: '-3px' },
                color: C.white,
                mb: 3,
              }}
            >
              Le digital{' '}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.purple} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                professionnel
              </Box>
              ,<br />
              structuré et{' '}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${C.purple} 0%, ${C.cyan} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                efficace.
              </Box>
            </Typography>
          </motion.div>

          {/* Subheadline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.26 }}>
            <Typography
              sx={{
                color: C.muted,
                fontSize: { xs: '1rem', md: '1.18rem' },
                maxWidth: 580,
                mx: 'auto',
                mb: 5,
                lineHeight: 1.75,
              }}
            >
              Connectez entreprises et talents digitaux autour de projets structurés, suivis et
              mesurables. Fini les recrutements hasardeux — bonjour la collaboration professionnelle.
            </Typography>
          </motion.div>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.4 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push(Routes.Auth.Login)}
                sx={{
                  background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
                  color: '#050F1C',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.4,
                  minWidth: 220,
                  boxShadow: `0 8px 32px ${C.cyanDim}`,
                  '&:hover': { opacity: 0.88, transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Je suis une Entreprise
              </Button>
              <Button
                size="large"
                onClick={() => router.push(Routes.Auth.Login)}
                sx={{
                  color: C.white,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.4,
                  minWidth: 220,
                  border: `1.5px solid ${C.cyanBorder}`,
                  bgcolor: C.cyanDim,
                  backdropFilter: 'blur(8px)',
                  '&:hover': { bgcolor: 'rgba(0,229,255,0.16)', borderColor: C.cyan },
                  transition: 'all 0.2s ease',
                }}
              >
                Je suis un Talent digital
              </Button>
            </Stack>
          </motion.div>

          {/* Social proof numbers */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.75 }}>
            <Stack
              direction="row"
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: 7, gap: { xs: 3, sm: 5 } }}
            >
              {[
                { n: '500+', label: 'Talents actifs' },
                { n: '200+', label: 'Entreprises' },
                { n: '1 000+', label: 'Projets lancés' },
                { n: '98%', label: 'Satisfaction' },
              ].map((s) => (
                <Box key={s.label} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: C.cyan, fontWeight: 800, fontSize: '1.6rem', lineHeight: 1 }}>
                    {s.n}
                  </Typography>
                  <Typography sx={{ color: C.muted, fontSize: '0.78rem', mt: 0.4 }}>{s.label}</Typography>
                </Box>
              ))}
            </Stack>
          </motion.div>
        </Box>
      </Container>

      {/* Bottom gradient fade */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: `linear-gradient(transparent, ${C.bg})`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURES
// ═══════════════════════════════════════════════════════════════════════════════
const FeaturesSection = () => {
  const features = [
    {
      icon: <AutoAwesomeIcon />,
      title: 'Matching Intelligent',
      desc: 'Notre algorithme connecte instantanément vos besoins aux talents les plus adaptés parmi notre réseau qualifié.',
      accent: C.cyan,
    },
    {
      icon: <DescriptionOutlinedIcon />,
      title: 'Pitching Structuré',
      desc: 'Recevez des propositions complètes avec budget, délais et méthodologie. Comparez et choisissez sereinement.',
      accent: C.purple,
    },
    {
      icon: <WorkOutlineIcon />,
      title: 'Gestion de Projets',
      desc: 'Du brief à la livraison finale, centralisez toutes les étapes de vos projets digitaux en un seul espace.',
      accent: C.cyan,
    },
    {
      icon: <EqualizerIcon />,
      title: "Suivi d'Impact Média",
      desc: "Dashboards analytiques en temps réel pour mesurer la portée et l'impact digital de vos campagnes.",
      accent: C.purple,
    },
    {
      icon: <ChatBubbleOutlineIcon />,
      title: 'Collaboration Temps Réel',
      desc: 'Chat intégré, partage de fichiers et workspaces dédiés par projet pour une fluidité maximale.',
      accent: C.cyan,
    },
    {
      icon: <ShieldOutlinedIcon />,
      title: 'Paiement Sécurisé',
      desc: 'Transactions protégées avec validation par jalons. Votre argent est libéré uniquement à votre satisfaction.',
      accent: C.purple,
    },
  ];

  return (
    <AnimSection id="features" bg={C.bgAlt}>
      <Label>Fonctionnalités</Label>
      <Heading line1="Tout ce dont vous avez besoin," gradient="en un seul endroit." />
      <Sub maxW={560}>
        Une plateforme complète qui centralise tout le cycle de vie de vos projets digitaux, de l'idée au résultat.
      </Sub>

      <Grid container spacing={3}>
        {features.map((f, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <motion.div variants={fadeUp} style={{ height: '100%' }}>
              <Box
                sx={{
                  bgcolor: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  p: 3.5,
                  height: '100%',
                  transition: 'all 0.28s ease',
                  '&:hover': {
                    bgcolor: C.cardHover,
                    borderColor: f.accent === C.cyan ? C.cyanBorder : C.purpleBorder,
                    transform: 'translateY(-5px)',
                    boxShadow: `0 24px 48px ${f.accent === C.cyan ? C.cyanDim : C.purpleDim}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: f.accent === C.cyan ? C.cyanDim : C.purpleDim,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    '& svg': { color: f.accent, fontSize: 22 },
                  }}
                >
                  {f.icon}
                </Box>
                <Typography sx={{ color: C.white, fontWeight: 700, fontSize: '1.05rem', mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: '0.88rem', lineHeight: 1.72 }}>
                  {f.desc}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimSection>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════════
const HowSection = () => {
  const steps = [
    {
      num: '01',
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 30 }} />,
      title: 'Publiez votre besoin',
      desc: 'Créez un brief en quelques minutes : objectifs, budget, délais et compétences recherchées. Simple et précis.',
    },
    {
      num: '02',
      icon: <GroupsOutlinedIcon sx={{ fontSize: 30 }} />,
      title: 'Recevez des pitchs',
      desc: 'Des talents qualifiés vous soumettent des propositions structurées. Comparez, échangez et sélectionnez.',
    },
    {
      num: '03',
      icon: <TrendingUpIcon sx={{ fontSize: 30 }} />,
      title: 'Lancez & suivez',
      desc: 'Gérez votre projet en temps réel : jalons, livrables, communication, paiements et impact médiatique.',
    },
  ];

  return (
    <AnimSection id="how" bg={C.bg}>
      <Label>Comment ça marche</Label>
      <Heading line1="De l'idée au résultat" gradient="en 3 étapes." />
      <Sub>Un processus simple et transparent pour lancer vos projets digitaux avec succès.</Sub>

      <Grid container spacing={3}>
        {steps.map((s, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div variants={fadeUp} style={{ height: '100%' }}>
              <Box
                sx={{
                  position: 'relative',
                  bgcolor: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  p: 4,
                  height: '100%',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
                    borderRadius: '12px 12px 0 0',
                    opacity: 0.7,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      border: `1.5px solid ${C.cyanBorder}`,
                      bgcolor: C.cyanDim,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: C.cyan,
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '2.8rem',
                      lineHeight: 1,
                      color: C.border,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {s.num}
                  </Typography>
                </Stack>
                <Typography sx={{ color: C.white, fontWeight: 700, fontSize: '1.15rem', mb: 1.5 }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: '0.9rem', lineHeight: 1.72 }}>
                  {s.desc}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimSection>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FOR WHO
// ═══════════════════════════════════════════════════════════════════════════════
const ForWhoSection = () => {
  const router = useRouter();

  const cards = [
    {
      tag: 'Entreprises',
      title: 'Trouvez les bons\ntalents, rapidement.',
      desc: "Publiez vos besoins, recevez des propositions qualifiées et gérez vos projets digitaux de A à Z avec une transparence totale.",
      benefits: [
        'Accès à 500+ talents vérifiés',
        'Propositions avec budget & délais inclus',
        'Dashboard de suivi de projet intégré',
        "Mesure de l'impact médiatique en temps réel",
        'Paiement sécurisé et libération par jalons',
      ],
      cta: 'Je cherche des talents',
      accent: C.cyan,
      dimBg: `linear-gradient(145deg, rgba(0,229,255,0.07) 0%, rgba(0,229,255,0.02) 100%)`,
      border: C.cyanBorder,
    },
    {
      tag: 'Créateurs & Talents',
      title: 'Décrochez des\nmissions qualifiées.',
      desc: "Présentez votre expertise, soumettez des pitchs professionnels et collaborez avec des marques et entreprises sérieuses.",
      benefits: [
        'Profil professionnel enrichi et mis en avant',
        'Accès direct aux projets des entreprises',
        'Pitching structuré et valorisant',
        'Visibilité et réputation construite en ligne',
        'Collaborations simplifiées et paiements sécurisés',
      ],
      cta: 'Je propose mes services',
      accent: C.purple,
      dimBg: `linear-gradient(145deg, rgba(123,97,255,0.07) 0%, rgba(123,97,255,0.02) 100%)`,
      border: C.purpleBorder,
    },
  ];

  return (
    <AnimSection id="forwho" bg={C.bgAlt}>
      <Label>Pour qui</Label>
      <Heading line1="Une plateforme," gradient="deux univers." />
      <Sub>Que vous soyez une entreprise ou un talent digital, SMIACT est conçu pour vous réussir.</Sub>

      <Grid container spacing={4}>
        {cards.map((card, i) => (
          <Grid item xs={12} md={6} key={i}>
            <motion.div variants={fadeUp} style={{ height: '100%' }}>
              <Box
                sx={{
                  background: card.dimBg,
                  border: `1px solid ${card.border}`,
                  borderRadius: 3,
                  p: { xs: 3.5, md: 5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Chip
                  label={card.tag}
                  sx={{
                    bgcolor: 'transparent',
                    border: `1px solid ${card.border}`,
                    color: card.accent,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    alignSelf: 'flex-start',
                    mb: 3,
                    height: 30,
                  }}
                />
                <Typography
                  sx={{
                    color: C.white,
                    fontWeight: 800,
                    fontSize: { xs: '1.7rem', md: '2.1rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    whiteSpace: 'pre-line',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {card.title}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: '0.93rem', lineHeight: 1.72, mb: 3.5 }}>
                  {card.desc}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4.5, flex: 1 }}>
                  {card.benefits.map((b, j) => (
                    <Stack key={j} direction="row" spacing={1.5} alignItems="flex-start">
                      <CheckCircleOutlineIcon sx={{ color: card.accent, fontSize: 19, mt: 0.2, flexShrink: 0 }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                        {b}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => router.push(Routes.Auth.Login)}
                  sx={{
                    textTransform: 'none',
                    color: card.accent,
                    border: `1.5px solid ${card.border}`,
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    fontWeight: 700,
                    alignSelf: 'flex-start',
                    '&:hover': {
                      bgcolor: card.accent === C.cyan ? C.cyanDim : C.purpleDim,
                      borderColor: card.accent,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {card.cta}
                </Button>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimSection>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CTA / BETA SIGNUP
// ═══════════════════════════════════════════════════════════════════════════════
const CTASection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role) return;
    setSubmitted(true);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'rgba(255,255,255,0.04)',
      borderRadius: 2,
      '& fieldset': { borderColor: C.border },
      '&:hover fieldset': { borderColor: C.cyanBorder },
      '&.Mui-focused fieldset': { borderColor: C.cyan },
    },
    '& .MuiInputLabel-root': { color: C.muted },
    '& .MuiInputLabel-root.Mui-focused': { color: C.cyan },
    '& .MuiInputBase-input': { color: C.white },
    '& .MuiSelect-icon': { color: C.muted },
  };

  return (
    <Box
      id="cta"
      sx={{
        bgcolor: C.bg,
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Central glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 350,
          background: `radial-gradient(ellipse, ${C.cyanDim} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {(() => {
          const ref = useRef(null);
          const inView = useInView(ref, { once: true, margin: '-70px' });
          return (
            <motion.div
              ref={ref}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={stagger}
            >
              <Label>Rejoindre la Beta</Label>
              <Heading line1="Prêt à transformer" gradient="votre façon de collaborer ?" />
              <Sub maxW={460}>
                Soyez parmi les premiers à rejoindre SMIACT et révolutionnez vos collaborations digitales.
              </Sub>

              <motion.div variants={fadeUp}>
                <Box
                  sx={{
                    bgcolor: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    p: { xs: 3, md: 4.5 },
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {!submitted ? (
                    <Box component="form" onSubmit={handleSubmit}>
                      <Stack spacing={2.5}>
                        <TextField
                          fullWidth
                          label="Nom complet"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={inputSx}
                        />
                        <TextField
                          fullWidth
                          type="email"
                          label="Email professionnel"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={inputSx}
                        />
                        <FormControl fullWidth sx={inputSx}>
                          <InputLabel>Je suis...</InputLabel>
                          <Select
                            value={role}
                            label="Je suis..."
                            onChange={(e) => setRole(e.target.value)}
                            MenuProps={{ PaperProps: { sx: { bgcolor: '#081629', color: C.white } } }}
                          >
                            <MenuItem value="enterprise">Une Entreprise</MenuItem>
                            <MenuItem value="creator">Un Talent Digital</MenuItem>
                            <MenuItem value="ambassador">Un Ambassadeur</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          type="submit"
                          fullWidth
                          size="large"
                          endIcon={<RocketLaunchIcon />}
                          sx={{
                            textTransform: 'none',
                            background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
                            color: '#050F1C',
                            fontWeight: 700,
                            fontSize: '1rem',
                            borderRadius: 2.5,
                            py: 1.5,
                            mt: 0.5,
                            '&:hover': { opacity: 0.88 },
                          }}
                        >
                          Rejoindre la Beta
                        </Button>
                        <Typography sx={{ color: C.muted, fontSize: '0.76rem', textAlign: 'center' }}>
                          🔒 Vos données sont protégées. Aucun spam, promis.
                        </Typography>
                      </Stack>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CheckCircleOutlineIcon sx={{ color: C.cyan, fontSize: 60, mb: 2 }} />
                      <Typography variant="h5" sx={{ color: C.white, fontWeight: 700, mb: 1.5 }}>
                        Vous êtes sur la liste ! 🎉
                      </Typography>
                      <Typography sx={{ color: C.muted, lineHeight: 1.7 }}>
                        Merci <strong style={{ color: C.white }}>{name}</strong>. Nous vous contacterons
                        très prochainement avec vos accès Beta.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            </motion.div>
          );
        })()}
      </Container>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
const FooterSection = () => {
  const router = useRouter();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Box
      component="footer"
      sx={{ bgcolor: '#020B14', borderTop: `1px solid ${C.border}`, py: { xs: 5, md: 8 } }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} mb={5}>
          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1.8rem',
                background: `linear-gradient(90deg, ${C.cyan}, #fff)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                letterSpacing: '-0.5px',
              }}
            >
              SMIACT
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: '0.9rem', maxWidth: 260, lineHeight: 1.75, mb: 3 }}>
              Là où le digital devient action. La plateforme SaaS qui connecte entreprises et talents
              digitaux.
            </Typography>
          </Grid>

          {/* Navigation */}
          <Grid item xs={6} md={2.5}>
            <Typography
              sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, mb: 2 }}
            >
              Plateforme
            </Typography>
            {[
              { label: 'Fonctionnalités', id: 'features' },
              { label: 'Comment ça marche', id: 'how' },
              { label: 'Pour qui', id: 'forwho' },
              { label: 'Rejoindre la Beta', id: 'cta' },
            ].map((item) => (
              <Typography
                key={item.id}
                onClick={() => scrollTo(item.id)}
                sx={{
                  display: 'block',
                  color: C.muted,
                  fontSize: '0.9rem',
                  mb: 1.2,
                  cursor: 'pointer',
                  '&:hover': { color: C.cyan },
                  transition: 'color 0.18s',
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Grid>

          {/* Account */}
          <Grid item xs={6} md={2.5}>
            <Typography
              sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2, mb: 2 }}
            >
              Compte
            </Typography>
            {[
              { label: 'Se connecter', href: Routes.Auth.Login },
              { label: "S'inscrire", href: Routes.Auth.Login },
            ].map((item) => (
              <Typography
                key={item.label}
                onClick={() => router.push(item.href)}
                sx={{
                  display: 'block',
                  color: C.muted,
                  fontSize: '0.9rem',
                  mb: 1.2,
                  cursor: 'pointer',
                  '&:hover': { color: C.cyan },
                  transition: 'color 0.18s',
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ borderTop: `1px solid ${C.border}`, pt: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem' }}>
              © {new Date().getFullYear()} SMIACT — Tous droits réservés.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.83rem' }}>
              Fait avec ❤️ pour le digital
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SMIACT — Là où le digital devient action.</title>
        <meta
          name="description"
          content="Connectez entreprises et talents digitaux autour de projets structurés, suivis et mesurables. Rejoignez la Beta SMIACT."
        />
        <meta name="theme-color" content="#050F1C" />
      </Head>
      <Box sx={{ bgcolor: C.bg, minHeight: '100vh', overflowX: 'hidden' }}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowSection />
        <ForWhoSection />
        <CTASection />
        <FooterSection />
      </Box>
    </>
  );
};

// Bypass the default app Layout (no white app Topbar on landing page)
(LandingPage as any).getLayout = (page: React.ReactNode) => <>{page}</>;

export const getStaticProps = async () => ({ props: {} });

export default LandingPage;
