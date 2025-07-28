import { User } from '@modules/users/defs/types';
import React, { useState } from 'react';
import { TFunction } from 'i18next';
import CreatorMainContent from './CreatorMainContent';
import AmbassadorMainContent from '@modules/ambassadors/components/AmbassadorMainContent';
import { Chip, Tab, Tabs } from '@mui/material';

interface CreatorAndAmbassadorMainContentProps {
  user: User;
  t: TFunction;
}

const CreatorAndAmbassadorMainContent = ({ user, t }: CreatorAndAmbassadorMainContentProps) => {
  const [showTab, setShowTab] = useState<'creator' | 'ambassador'>('creator');
  // ambassador status
  const ambassadorStatusChip = () => {
    if (user.ambassador?.applicationStatus === 'PENDING') {
      return (
        <Chip label={t('user:ambassador_status_pending', 'Pending')} color="warning" size="small" />
      );
    }
    if (user.ambassador?.applicationStatus === 'REJECTED') {
      return (
        <Chip label={t('user:ambassador_status_rejected', 'Rejected')} color="error" size="small" />
      );
    }
    return <></>;
  };

  return (
    <>
      <Tabs value={showTab} onChange={(e, value) => setShowTab(value)} variant="fullWidth">
        <Tab
          label={t('user:creator', 'Creator')}
          value="creator"
          // sx={{
          //   backgroundColor: showTab === 'creator' ? 'primary.main' : 'transparent',
          //   color: showTab === 'creator' ? 'white' : 'text.secondary',
          // }}
        />
        <Tab
          label={t('user:ambassador', 'Ambassador')}
          value="ambassador"
          iconPosition="end"
          icon={ambassadorStatusChip()}
        />
      </Tabs>
      {showTab === 'creator' && <CreatorMainContent user={user} t={t} />}
      {showTab === 'ambassador' && <AmbassadorMainContent user={user} t={t} />}
    </>
  );
};

export default CreatorAndAmbassadorMainContent;
