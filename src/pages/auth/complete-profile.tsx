import { NextPage } from 'next';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Box,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  LocationOn,
  Notifications,
  Security,
  Share,
  ContactEmergency,
  // Settings,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import FormProvider from '@common/components/lib/react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import { useCompleteProfile } from '@modules/users/hooks/api/useCompleteProfile';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { useState } from 'react';
import StepPersonal from '@modules/users/components/partials/complete-profile/StepPersonal';
import StepAddress from '@modules/users/components/partials/complete-profile/StepAddress';
import StepNotifications from '@modules/users/components/partials/complete-profile/StepNotifications';
import StepPrivacy from '@modules/users/components/partials/complete-profile/StepPrivacy';
import StepSocial from '@modules/users/components/partials/complete-profile/StepSocial';
import StepEmergency from '@modules/users/components/partials/complete-profile/StepEmergency';
// import StepPreferences from '@modules/users/components/partials/complete-profile/StepPreferences';

const steps = [
  { key: 'personal', label: 'Personal Information', icon: Person },
  { key: 'address', label: 'Address', icon: LocationOn },
  { key: 'notifications', label: 'Notifications', icon: Notifications },
  { key: 'privacy', label: 'Privacy', icon: Security },
  { key: 'social', label: 'Social Media', icon: Share },
  { key: 'emergency', label: 'Emergency Contact', icon: ContactEmergency },
  // { key: 'preferences', label: 'Preferences', icon: Settings },
];

const CompleteProfile: NextPage = () => {
  const { t } = useTranslation(['common', 'user', 'auth']);
  const { methods, isLoading, isSubmitting, onSubmit, handleSkip, validateStep } =
    useCompleteProfile();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNext = async () => {
    // Validate current step before proceeding
    const isValid = await validateStep(activeStep);
    if (isValid) {
      // Mark current step as completed
      setCompletedSteps((prev) => new Set(Array.from(prev).concat(activeStep)));
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = async (step: number) => {
    // If clicking on a step ahead of current step, validate current step first
    if (step > activeStep) {
      const isValid = await validateStep(activeStep);
      if (isValid) {
        // Mark current step as completed
        setCompletedSteps((prev) => new Set(Array.from(prev).concat(activeStep)));
        setActiveStep(step);
      }
    } else {
      // If going back or to current step, allow it
      setActiveStep(step);
    }
  };

  const isStepCompleted = (step: number) => completedSteps.has(step);
  const isStepValid = (step: number) => {
    if (step < activeStep) {
      return true; // Previous steps are considered valid
    }
    if (step === activeStep) {
      return true; // Current step is being validated
    }
    return false; // Future steps are not yet validated
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          {t('user:loading_profile')}
        </Typography>
      </Box>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepPersonal methods={methods} t={t} />;
      case 1:
        return <StepAddress methods={methods} t={t} />;
      case 2:
        return <StepNotifications methods={methods} t={t} />;
      case 3:
        return <StepPrivacy methods={methods} t={t} />;
      case 4:
        return <StepSocial methods={methods} t={t} />;
      case 5:
        return <StepEmergency methods={methods} t={t} />;
      // case 6:
      //   return <StepPreferences methods={methods} t={t} />;
      default:
        return null;
    }
  };

  const getStepIconColor = (isCompleted: boolean, isActive: boolean, isValid: boolean) => {
    if (isCompleted) {
      return 'success.main';
    }
    if (isActive) {
      return 'primary.main';
    }
    if (isValid) {
      return 'info.main';
    }
    return 'grey.300';
  };

  const getStepIconHoverColor = (isCompleted: boolean, isActive: boolean, isValid: boolean) => {
    if (isCompleted) {
      return 'success.dark';
    }
    if (isActive) {
      return 'primary.dark';
    }
    if (isValid) {
      return 'info.dark';
    }
    return 'grey.400';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}08 0%, ${theme.palette.secondary.light}08 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('user:complete_your_profile')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('user:profile_completion_info')}
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ width: '100%', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(((activeStep + 1) / steps.length) * 100)}% Complete
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Stepper */}
          {!isMobile && (
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.key}>
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      sx={{ cursor: 'pointer' }}
                      StepIconComponent={({ active }) => {
                        const isCompleted = isStepCompleted(index);
                        const isValid = isStepValid(index);

                        return (
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: getStepIconColor(isCompleted, !!active, isValid),
                              color: 'white',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: getStepIconHoverColor(isCompleted, !!active, isValid),
                              },
                            }}
                          >
                            {isCompleted ? <CheckCircle /> : <step.icon />}
                          </Avatar>
                        );
                      }}
                    >
                      <Typography variant="caption" fontWeight={activeStep === index ? 600 : 400}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {/* Mobile Step Indicator */}
          {isMobile && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip
                label={`${activeStep + 1} / ${steps.length}`}
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="h6" fontWeight={600}>
                {steps[activeStep].label}
              </Typography>
            </Box>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            {/* Step Content */}
            <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

            {/* Navigation Buttons */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={2}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                    disabled={isSubmitting}
                  >
                    {t('common:back')}
                  </Button>
                )}
                <Button variant="outlined" onClick={handleSkip} disabled={isSubmitting}>
                  {t('common:skip_for_now')}
                </Button>
              </Stack>

              <Stack direction="row" spacing={2}>
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    disabled={isSubmitting}
                  >
                    {t('common:next')}
                  </Button>
                ) : (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    size="large"
                    endIcon={<CheckCircle />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    {t('user:complete_profile')}
                  </LoadingButton>
                )}
              </Stack>
            </Stack>
          </FormProvider>
        </Paper>
      </Container>
    </Box>
  );
};

export default withAuth(CompleteProfile, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'user',
      'common',
      'topbar',
      'auth',
      'notifications',
    ])),
  },
});
