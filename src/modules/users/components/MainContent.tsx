import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import JsonDataRenderer from './JsonDataRenderer';
import ChipList from './ChipList';
import CardList from './CardList';
import SectionCard from './SectionCard';

interface MainContentProps {
  user: Any;
  t: Any;
}

const MainContent = ({ user, t }: MainContentProps) => {
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openTestimonials, setOpenTestimonials] = useState(false);
  const [openCertifications, setOpenCertifications] = useState(false);
  const [openEmployment, setOpenEmployment] = useState(false);
  const [openOther, setOpenOther] = useState(false);

  const renderDialog = (title: string, open: boolean, onClose: () => void) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {title}</DialogTitle>
      <DialogContent>
        <Typography>Edit {title} form goes here.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Stack spacing={0}>
      {/* Title/About Section */}
      <SectionCard title={user?.profile?.title || t('user:about')} editLink="/users/edit-profile">
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || <Skeleton width="80%" />}
        </Typography>
      </SectionCard>

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
      {renderDialog('Portfolio', openPortfolio, () => setOpenPortfolio(false))}

      {/* Skills Section */}
      <SectionCard title="Skills" onEdit={() => setOpenSkills(true)}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <ChipList items={user?.creator?.skills || []} />
        </Stack>
      </SectionCard>
      {renderDialog('Skills', openSkills, () => setOpenSkills(false))}

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
      {renderDialog('Certifications', openCertifications, () => setOpenCertifications(false))}

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
      {renderDialog('Employment History', openEmployment, () => setOpenEmployment(false))}

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
      {renderDialog('Achievements', openAchievements, () => setOpenAchievements(false))}

      {/* Testimonials Section */}
      {/* <SectionCard title="Testimonials" onEdit={() => setOpenTestimonials(true)}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showcase your skills with non-Upwork client testimonials
        </Typography>
      </SectionCard>
      {renderDialog('Testimonials', openTestimonials, () => setOpenTestimonials(false))} */}

      {/* Other Experiences Section */}
      {/* <SectionCard title="Other Experiences" onEdit={() => setOpenOther(true)}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Add any other experiences that help you stand out.
        </Typography>
      </SectionCard>
      {renderDialog('Other Experiences', openOther, () => setOpenOther(false))} */}
    </Stack>
  );
};

export default MainContent;
