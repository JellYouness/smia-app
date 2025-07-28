import React, { useState } from 'react';
import SectionCard from '@modules/users/components/SectionCard';
import EditAboutDialog from '@modules/creators/components/creator-profle/dialogs/EditAboutDialog';
import AboutSection from '@common/components/AboutSection';
import { Any } from '@common/defs/types';
import { User } from '@modules/users/defs/types';
import { TFunction } from 'i18next';

interface AboutSectionBlockProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
  updateAbout: (userId: string, data: Any) => Promise<Any>;
  loading: boolean;
}

const AboutSectionBlock = ({ user, t, readOnly, updateAbout, loading }: AboutSectionBlockProps) => {
  const [openAbout, setOpenAbout] = useState(false);

  const handleSaveAbout = async (data: Any) => {
    const response = await updateAbout(user.id.toString(), data);
    if (response.success) {
      setOpenAbout(false);
    }
  };

  return (
    <>
      <SectionCard title={t('user:about')} readOnly={readOnly} onEdit={() => setOpenAbout(true)}>
        <AboutSection
          title={user?.profile?.title}
          bio={user?.profile?.bio}
          shortBio={user?.profile?.shortBio}
          hourlyRate={user?.client?.hourlyRate}
        />
      </SectionCard>
      <EditAboutDialog
        user={user}
        open={openAbout}
        onClose={() => setOpenAbout(false)}
        onSave={handleSaveAbout}
        loading={loading}
      />
    </>
  );
};

export default AboutSectionBlock;
