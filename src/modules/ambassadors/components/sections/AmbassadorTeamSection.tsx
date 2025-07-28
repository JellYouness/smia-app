import React from 'react';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { Business } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';
// import { TeamMembersSection } from '../TeamMembersSection';

interface AmbassadorTeamSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}
const AmbassadorTeamSection = ({ ambassador, t, readOnly, onEdit }: AmbassadorTeamSectionProps) => (
  <SectionCard title={t('user:team') || 'Team'} readOnly={readOnly} onEdit={onEdit}>
    <InfoItem
      label={t('user:team_name') || 'Team Name'}
      value={ambassador.teamName}
      icon={<Business />}
    />
    {/* <TeamMembersSection ambassadorId={ambassador.id} readOnly={readOnly} /> */}
  </SectionCard>
);

export default AmbassadorTeamSection;
