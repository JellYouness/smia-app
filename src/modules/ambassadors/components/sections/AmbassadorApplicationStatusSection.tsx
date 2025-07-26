import React from 'react';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { CheckCircle, CalendarMonth } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface AmbassadorApplicationStatusSectionProps {
  ambassador: Ambassador;
  t: TFunction;
}

const AmbassadorApplicationStatusSection = ({
  ambassador,
  t,
}: AmbassadorApplicationStatusSectionProps) => (
  <SectionCard title={t('user:application_status') || 'Application Status'} readOnly>
    <InfoItem
      label={t('user:application_status') || 'Application Status'}
      value={ambassador.applicationStatus}
      icon={
        <CheckCircle
          color={
            // eslint-disable-next-line no-nested-ternary
            ambassador.applicationStatus === 'APPROVED'
              ? 'success'
              : ambassador.applicationStatus === 'REJECTED'
              ? 'error'
              : 'warning'
          }
        />
      }
    />
    <InfoItem
      label={t('user:application_date') || 'Application Date'}
      value={ambassador.applicationDate}
      icon={<CalendarMonth />}
    />
  </SectionCard>
);

export default AmbassadorApplicationStatusSection;
