import useCreators from '@modules/creators/hooks/useCreators';
import { Creator } from '@modules/creators/defs/types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  Button,
  Skeleton,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Done, Star, PersonOffOutlined } from '@mui/icons-material';
import LanguageChips from '../LanguageChips';
import useProjects from '@modules/projects/hooks/useProjects';
import { Id } from '@common/defs/types';
import { Project } from '@modules/projects/defs/types';
import InviteMessageModal from '../InviteMessageModal';

interface InviteCreatorsStepProps {
  projectId: Id;
  project: Project;
}

const InviteCreatorsStep = ({ projectId, project }: InviteCreatorsStepProps) => {
  const { t } = useTranslation(['project', 'common', 'user']);
  const theme = useTheme();
  const { readAll } = useCreators();
  const { inviteCreator } = useProjects();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [invited, setInvited] = useState<number[]>([]);
  const [inviteMessageModalOpen, setInviteMessageModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    setInvited(project.invitedCreatorIds ?? []);
  }, [project.invitedCreatorIds]);

  const fetchCreators = async () => {
    setLoading(true);
    const response = await readAll();
    if (response.success && response.data) {
      // Parse JSON string fields
      const parsedCreators = response.data.items.map((creator) => ({
        ...creator,
        skills: typeof creator.skills === 'string' ? JSON.parse(creator.skills) : creator.skills,
        languages:
          typeof creator.languages === 'string' ? JSON.parse(creator.languages) : creator.languages,
        regionalExpertise:
          typeof creator.regionalExpertise === 'string'
            ? JSON.parse(creator.regionalExpertise)
            : creator.regionalExpertise,
      }));
      setCreators(parsedCreators);
    }
    setLoading(false);
  };

  const handleInvite = async (creatorId: Id, message: string) => {
    const response = await inviteCreator({
      projectId,
      creatorId,
      message,
    });
    if (response.success) {
      setInvited((prev) => [...prev, creatorId]);
      setInviteMessageModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'BUSY':
        return 'warning';
      case 'LIMITED':
        return 'info';
      default:
        return 'error';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Check fontSize="small" />;
      case 'FEATURED':
        return <Star fontSize="small" />;
      default:
        return null;
    }
  };

  const renderSkeleton = () => (
    <Box height="100%" overflow="auto">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box ml={2} flexGrow={1}>
                <Skeleton width="30%" />
                <Skeleton width="20%" />
              </Box>
              <Skeleton width={100} height={36} />
            </Box>
            <Box mt={2} display="flex">
              <Box flexGrow={1}>
                <Skeleton width="80%" />
                <Skeleton width="60%" />
                <Skeleton width="70%" />
              </Box>
              <Skeleton width={80} height={32} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box height={600} overflow="auto">
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            {creators.map((creator, index) => {
              return (
                <Card
                  key={creator.id}
                  sx={{
                    mb: 2,
                    borderLeft: invited.includes(creator.id)
                      ? `4px solid ${theme.palette.success.main}`
                      : 'none',
                    transition: 'all 0.2s ease',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                      {/* Avatar and Basic Info */}
                      <Box display="flex" alignItems="center" flexGrow={1} mb={{ xs: 2, sm: 0 }}>
                        <Avatar
                          src={creator.user?.profileImage || ''}
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 56,
                            height: 56,
                            mr: 2,
                          }}
                        >
                          {creator.user?.firstName[0]}
                          {creator.user?.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {creator.user?.firstName} {creator.user?.lastName}
                          </Typography>

                          <Box display="flex" alignItems="center">
                            <Rating
                              value={creator.averageRating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="body2" ml={1} color="textSecondary">
                              ({creator.ratingCount})
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Status Chips */}
                      <Box
                        display="flex"
                        mb={{ xs: 2, sm: 0 }}
                        mx={{ xs: 0, sm: 2 }}
                        alignItems="center"
                      >
                        <Chip
                          label={t(`user:${creator.verificationStatus.toLowerCase()}`)}
                          size="small"
                          color={creator.verificationStatus === 'FEATURED' ? 'primary' : 'default'}
                          icon={
                            getVerificationIcon(creator.verificationStatus) as React.ReactElement
                          }
                          sx={{ mr: 1, p: 2 }}
                        />
                        <Chip
                          label={t(`user:${creator.availability.toLowerCase()}`)}
                          size="small"
                          color={getStatusColor(creator.availability)}
                          variant="outlined"
                          sx={{ p: 2 }}
                        />
                      </Box>

                      {/* Invite Button */}
                      <Button
                        variant={invited.includes(creator.id) ? 'contained' : 'outlined'}
                        color={invited.includes(creator.id) ? 'success' : 'primary'}
                        onClick={() => {
                          setSelectedCreator(creator);
                          setInviteMessageModalOpen(true);
                        }}
                        disabled={invited.includes(creator.id)}
                        startIcon={invited.includes(creator.id) ? <Done /> : null}
                        size="medium"
                        sx={{ minWidth: 120 }}
                      >
                        {invited.includes(creator.id) ? t('common:invited') : t('common:invite')}
                      </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Detailed Information */}
                    <Box display="flex" flexWrap="wrap">
                      <Box
                        flexGrow={1}
                        minWidth={300}
                        mb={{ xs: 2, md: 0 }}
                        gap={1}
                        display="flex"
                        flexDirection="column"
                      >
                        <Box display="flex" flexWrap="wrap" gap={3} alignItems="center">
                          <Typography variant="body1" color="textPrimary">
                            ${creator.hourlyRate.toFixed(2)}/hr
                          </Typography>

                          <Typography variant="body1" color="textPrimary">
                            {creator.experience} {t('common:years_experience')}
                          </Typography>
                        </Box>

                        <LanguageChips languages={creator.languages} />

                        <Box>
                          <Typography variant="subtitle2" mb={1}>
                            {t('common:skills')}
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" gap={0.5}>
                            {creator.skills.slice(0, 4).map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill.replace(/_/g, ' ')}
                                size="small"
                                sx={{
                                  fontSize: '0.75rem',
                                  p: 2,
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}

        {!loading && creators.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={4}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                borderRadius: '50%',
                width: 72,
                height: 72,
                boxShadow: 3,
              }}
            >
              <PersonOffOutlined sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h6" mb={2}>
              {t('project:no_creators_found')}
            </Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center">
              {t('project:no_creators_description')}
            </Typography>
          </Box>
        )}
      </Box>

      <InviteMessageModal
        open={inviteMessageModalOpen}
        creator={selectedCreator}
        onClose={() => setInviteMessageModalOpen(false)}
        onSubmit={(message: string) => {
          if (selectedCreator) {
            handleInvite(selectedCreator.id, message);
          }
        }}
      />
    </Box>
  );
};

export default InviteCreatorsStep;
