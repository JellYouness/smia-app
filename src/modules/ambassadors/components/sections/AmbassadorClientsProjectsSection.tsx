import React from 'react';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { People, Build } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface AmbassadorClientsProjectsSectionProps {
  ambassador: Ambassador;
  t: TFunction;
}

const AmbassadorClientsProjectsSection = ({
  ambassador,
  t,
}: AmbassadorClientsProjectsSectionProps) => (
  <SectionCard title={t('user:clients_projects') || 'Clients & Projects'} readOnly>
    <InfoItem
      label={t('user:client_count') || 'Client Count'}
      value={ambassador.clientCount}
      icon={<People />}
    />
    <InfoItem
      label={t('user:project_capacity') || 'Project Capacity'}
      value={ambassador.projectCapacity}
      icon={<Build />}
    />
  </SectionCard>
);

export default AmbassadorClientsProjectsSection;
