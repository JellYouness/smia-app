import React from 'react';
import { Box, Stack, Typography, Chip, Grid, Button, Skeleton } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { Star, Work } from '@mui/icons-material';
import CardList from '@modules/users/components/CardList';
import Link from 'next/link';
import { Any } from '@common/defs/types';

interface CreatorMainContentProps {
  user: any;
  t: any;
  readOnly?: boolean;
}

const CreatorMainContent = ({ user, t, readOnly }: CreatorMainContentProps) => {
  const creator = user.creator || user; // support both user.creator and direct creator
  return (
    <Stack spacing={0}>
      {/* About Section */}
      <SectionCard title={user?.profile?.title || t('user:about')} readOnly={readOnly}>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || 'No bio provided.'}
        </Typography>
      </SectionCard>

      {/* Skills Section */}
      <SectionCard title={t('user:skills') || 'Skills'} readOnly={readOnly}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {creator.skills?.length > 0 ? (
            creator.skills?.map((skill: string, index: number) => (
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
                No skills added yet.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Portfolio Section */}
      <SectionCard title={t('user:portfolio') || 'Portfolio'} readOnly={readOnly}>
        <CardList
          items={creator.portfolio || []}
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

      {/* Languages */}
      {/* <SectionCard title={t('user:languages') || 'Languages'} readOnly={readOnly}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(creator.languages, null, 2)}</pre>
      </SectionCard> */}

      {/* Education */}
      {/* <SectionCard title={t('user:education') || 'Education'} readOnly={readOnly}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(creator.education, null, 2)}</pre>
      </SectionCard> */}

      {/* Certifications */}
      <SectionCard title={t('user:certifications') || 'Certifications'} readOnly={readOnly}>
        <Stack spacing={3}>
          {creator.certifications && creator.certifications.length > 0 ? (
            creator.certifications.map((cert: Any, index: number) => (
              <Box
                key={index}
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
                Listing your certifications can help prove your specific knowledge or abilities.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Achievements */}
      <SectionCard title={t('user:achievements') || 'Achievements'} readOnly={readOnly}>
        <Stack spacing={2}>
          {creator.achievements && creator.achievements.length > 0 ? (
            creator.achievements.map((achievement: string, index: number) => (
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
                Highlight your key achievements and accomplishments.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Professional Background */}
      <SectionCard
        title={t('user:professional_background') || 'Professional Background'}
        readOnly={readOnly}
      >
        <Stack spacing={3}>
          {creator.professionalBackground && creator.professionalBackground.length > 0 ? (
            creator.professionalBackground.map((job: any, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
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
                Add your employment history to help clients understand your background.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>

      {/* Media Types */}
      <SectionCard title={t('user:media_types') || 'Media Types'} readOnly={readOnly}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {creator.mediaTypes?.length > 0 ? (
            creator.mediaTypes?.map((mediaType: string, index: number) => (
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

      {/* Equipment Info */}
      <SectionCard title={t('user:equipment_info') || 'Equipment Info'} readOnly={readOnly}>
        <Stack spacing={3}>
          {creator.equipmentInfo && Object.keys(creator.equipmentInfo || {}).length > 0 ? (
            <Stack spacing={2}>
              {Object.entries(creator.equipmentInfo || {}).map(
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

      {/* Regional Expertise */}
      <SectionCard title={t('user:regional_expertise') || 'Regional Expertise'} readOnly={readOnly}>
        <Stack spacing={2}>
          {creator.regionalExpertise?.length > 0 ? (
            creator.regionalExpertise?.map((expertise: Any, index: number) => (
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
                No regional expertise added yet.
              </Typography>
            </Box>
          )}
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export default CreatorMainContent;
