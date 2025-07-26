import React from 'react';
import { Stack, Typography, Box, Avatar } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { Business, People } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface AmbassadorTeamSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const dummyTeamMembers = [
  {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
    title: 'Frontend Developer',
  },
  {
    name: 'Jane Smith',
    avatar: 'https://via.placeholder.com/150',
    title: 'Backend Developer at Google',
  },
];

const AmbassadorTeamSection = ({ ambassador, t, readOnly, onEdit }: AmbassadorTeamSectionProps) => (
  <SectionCard title={t('user:team') || 'Team'} readOnly={readOnly} onEdit={onEdit}>
    <InfoItem
      label={t('user:team_name') || 'Team Name'}
      value={ambassador.teamName}
      icon={<Business />}
    />
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
      <People color="primary" fontSize="medium" />
      <Typography variant="body1" fontWeight={600} color="text.secondary">
        {t('user:team_members') || 'Team Members'}:
      </Typography>
    </Stack>
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1.5, ml: 4 }}>
      {dummyTeamMembers.map((member, idx) => (
        <Box
          key={idx}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid',
            borderColor: 'primary.main',
            px: 2,
            py: 1,
            borderRadius: 12,
            '&:hover': {
              backgroundColor: 'primary.lighter',
            },
          }}
        >
          <Avatar
            src={member.avatar}
            sx={{ width: 38, height: 38, backgroundColor: 'primary.light' }}
          >
            {member.name.charAt(0)}
          </Avatar>
          <Stack direction="column">
            <Typography variant="body2">{member.name}</Typography>
            <Typography variant="subtitle2">{member.title}</Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  </SectionCard>
);

export default AmbassadorTeamSection;
