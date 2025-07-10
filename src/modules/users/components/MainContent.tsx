import React, { useState } from 'react';
import { Box, Stack, Typography, Skeleton, Button, Chip } from '@mui/material';
import { Star } from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import JsonDataRenderer from './JsonDataRenderer';
import ChipList from './ChipList';
import CardList from './CardList';
import SectionCard from './SectionCard';
import EditAboutDialog from './EditAboutDialog';
import EditSkillsDialog from './EditSkillsDialog';
import EditPortfolioDialog from './EditPortfolioDialog';
import EditCertificationsDialog from './EditCertificationsDialog';
import EditEmploymentDialog from './EditEmploymentDialog';
import EditAchievementsDialog from './EditAchievementsDialog';
import EditEquipmentDialog from './EditEquipmentDialog';
import EditRegionalExpertiseDialog from './EditRegionalExpertiseDialog';
import EditMediaTypesDialog from './EditMediaTypesDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';

interface MainContentProps {
  user: Any;
  t: Any;
}

const MainContent = ({ user, t }: MainContentProps) => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openCertifications, setOpenCertifications] = useState(false);
  const [openEmployment, setOpenEmployment] = useState(false);
  const [openEquipment, setOpenEquipment] = useState(false);
  const [openRegionalExpertise, setOpenRegionalExpertise] = useState(false);
  const [openMediaTypes, setOpenMediaTypes] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    updateAbout,
    updatePortfolio,
    updateSkills,
    updateCertifications,
    updateEmployment,
    updateAchievements,
    updateEquipment,
    updateRegionalExpertise,
    updateMediaTypes,
  } = useProfileUpdates();

  const handleSaveAbout = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateAbout(user.id, data);
      if (response.success) {
        setOpenAbout(false);
      }
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkills = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateSkills(user.id, data);
      if (response.success) {
        setOpenSkills(false);
      }
    } catch (error) {
      console.error('Error saving skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePortfolio = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updatePortfolio(user.id, data);
      if (response.success) {
        setOpenPortfolio(false);
      }
    } catch (error) {
      console.error('Error saving portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCertifications = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateCertifications(user.id, data);
      if (response.success) {
        setOpenCertifications(false);
      }
    } catch (error) {
      console.error('Error saving certifications data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmployment = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateEmployment(user.id, data);
      if (response.success) {
        setOpenEmployment(false);
      }
    } catch (error) {
      console.error('Error saving employment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAchievements = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateAchievements(user.id, data);
      if (response.success) {
        setOpenAchievements(false);
      }
    } catch (error) {
      console.error('Error saving achievements data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEquipment = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateEquipment(user.id, data);
      if (response.success) {
        setOpenEquipment(false);
      }
    } catch (error) {
      console.error('Error saving equipment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRegionalExpertise = async (data: Any) => {
    try {
      console.log('handleSaveRegionalExpertise called with data:', data);
      console.log('data.regionalExpertise:', data.regionalExpertise);
      setLoading(true);
      const response = await updateRegionalExpertise(user.id, data.regionalExpertise);
      if (response.success) {
        setOpenRegionalExpertise(false);
      }
    } catch (error) {
      console.error('Error saving regional expertise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMediaTypes = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateMediaTypes(user.id, data);
      if (response.success) {
        setOpenMediaTypes(false);
      }
    } catch (error) {
      console.error('Error saving media types data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={0}>
      {/* Title/About Section */}
      <SectionCard
        title={user?.profile?.title || t('user:about')}
        onEdit={() => setOpenAbout(true)}
      >
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || <Skeleton width="80%" />}
        </Typography>
      </SectionCard>

      {/* About Edit Dialog */}
      <EditAboutDialog
        user={user}
        onSave={handleSaveAbout}
        loading={loading}
        open={openAbout}
        onClose={() => setOpenAbout(false)}
      />

      {/* Portfolio Section */}
      <SectionCard title="Portfolio" onEdit={() => setOpenPortfolio(true)}>
        <CardList
          items={user?.creator?.portfolio || []}
          renderCard={(item) => (
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                mb: 2,
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {item.description}
              </Typography>
              {item.url && (
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    View Project
                  </Button>
                </Link>
              )}
            </Box>
          )}
          fallback={
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Showcase your best work and projects.
              </Typography>
            </Box>
          }
        />
      </SectionCard>

      {/* Portfolio Edit Dialog */}
      <EditPortfolioDialog
        user={user}
        onSave={handleSavePortfolio}
        loading={loading}
        open={openPortfolio}
        onClose={() => setOpenPortfolio(false)}
      />

      {/* Skills Section */}
      <SectionCard title="Skills" onEdit={() => setOpenSkills(true)}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {user?.creator?.skills?.length > 0 ? (
            user?.creator?.skills?.map((skill: string, index: number) => (
              <Chip key={index} label={skill} size="small" variant="outlined" color="primary" />
            ))
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Add your skills to showcase your expertise to potential clients.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Skills Edit Dialog */}
      <EditSkillsDialog
        user={user}
        onSave={handleSaveSkills}
        loading={loading}
        open={openSkills}
        onClose={() => setOpenSkills(false)}
      />

      {/* Regional Expertise Section */}
      <SectionCard title="Regional Expertise" onEdit={() => setOpenRegionalExpertise(true)}>
        <Stack spacing={2}>
          {user?.creator?.regionalExpertise?.length > 0 ? (
            user?.creator?.regionalExpertise?.map((expertise: Any, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {expertise.region}
                  </Typography>
                  <Chip
                    label={expertise.expertiseLevel}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Add your regional expertise to help clients understand your geographic knowledge.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Regional Expertise Edit Dialog */}
      <EditRegionalExpertiseDialog
        user={user}
        onSave={handleSaveRegionalExpertise}
        loading={loading}
        open={openRegionalExpertise}
        onClose={() => setOpenRegionalExpertise(false)}
      />

      {/* Media Types Section */}
      <SectionCard title="Media Types" onEdit={() => setOpenMediaTypes(true)}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {user?.creator?.mediaTypes?.length > 0 ? (
            user?.creator?.mediaTypes?.map((mediaType: string, index: number) => (
              <Chip key={index} label={mediaType} size="small" variant="outlined" color="primary" />
            ))
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Add the types of media you specialize in.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Media Types Edit Dialog */}
      <EditMediaTypesDialog
        user={user}
        onSave={handleSaveMediaTypes}
        loading={loading}
        open={openMediaTypes}
        onClose={() => setOpenMediaTypes(false)}
      />

      {/* Certifications Section */}
      <SectionCard title="Certifications" onEdit={() => setOpenCertifications(true)}>
        <Stack spacing={3}>
          <JsonDataRenderer
            data={user?.creator?.certifications || []}
            renderItem={(cert) => (
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'success.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 32,
                    right: 24,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'success.dark' }}>
                  {cert.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Issued by: {cert.issuer}
                </Typography>
                {cert.date && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Date: {cert.date}
                  </Typography>
                )}
              </Box>
            )}
            fallback={
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Listing your certifications can help prove your specific knowledge or abilities.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </SectionCard>

      {/* Certifications Edit Dialog */}
      <EditCertificationsDialog
        user={user}
        onSave={handleSaveCertifications}
        loading={loading}
        open={openCertifications}
        onClose={() => setOpenCertifications(false)}
      />

      {/* Employment History Section */}
      <SectionCard title="Employment History" onEdit={() => setOpenEmployment(true)}>
        <Stack spacing={3}>
          <JsonDataRenderer
            data={user?.creator?.professionalBackground || []}
            renderItem={(job) => (
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '0 16px 16px 0',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'primary.main',
                  }}
                />
                <Box sx={{ pl: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    {job.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    {job.company} • {job.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {job.description}
                  </Typography>
                </Box>
              </Box>
            )}
            fallback={
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Add your employment history to help clients understand your background.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </SectionCard>

      {/* Employment Edit Dialog */}
      <EditEmploymentDialog
        user={user}
        onSave={handleSaveEmployment}
        loading={loading}
        open={openEmployment}
        onClose={() => setOpenEmployment(false)}
      />

      {/* Equipment Section */}
      <SectionCard title="Equipment" onEdit={() => setOpenEquipment(true)}>
        <Stack spacing={3}>
          {user?.creator?.equipmentInfo &&
          Object.keys(user?.creator?.equipmentInfo || {}).length > 0 ? (
            <Stack spacing={2}>
              {Object.entries(user?.creator?.equipmentInfo || {}).map(
                ([category, items]: [string, Any]) => (
                  <Box key={category}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: 'primary.main',
                        textTransform: 'capitalize',
                      }}
                    >
                      {category}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {Array.isArray(items) &&
                        items.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                    </Stack>
                  </Box>
                )
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                List your equipment to help clients understand your capabilities.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Equipment Edit Dialog */}
      <EditEquipmentDialog
        user={user}
        onSave={handleSaveEquipment}
        loading={loading}
        open={openEquipment}
        onClose={() => setOpenEquipment(false)}
      />

      {/* Achievements Section */}
      <SectionCard title="Achievements" onEdit={() => setOpenAchievements(true)}>
        <Stack spacing={3}>
          <JsonDataRenderer
            data={user?.creator?.achievements || []}
            renderItem={(achievement, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  pl: 3,
                  bgcolor: 'grey.50',
                  borderLeft: '6px solid',
                  borderColor: 'warning.main',
                  borderRadius: '0 16px 16px 0',
                  boxShadow: 0,
                  gap: 2,
                  position: 'relative',
                  minHeight: 56,
                  '&:hover': {
                    boxShadow: 2,
                    bgcolor: 'background.paper',
                    borderColor: 'primary.main',
                    transition: 'all 0.2s',
                  },
                }}
              >
                <Star sx={{ color: 'warning.main', fontSize: 28, mr: 2, flexShrink: 0 }} />
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {achievement}
                </Typography>
              </Box>
            )}
            fallback={
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Highlight your key achievements and accomplishments.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </SectionCard>

      {/* Achievements Edit Dialog */}
      <EditAchievementsDialog
        user={user}
        onSave={handleSaveAchievements}
        loading={loading}
        open={openAchievements}
        onClose={() => setOpenAchievements(false)}
      />
    </Stack>
  );
};

export default MainContent;
