import React, { useState } from 'react';
import { Stack } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import { Any } from '@common/defs/types';
import { User } from '@modules/users/defs/types';
import { TFunction } from 'i18next';
import AboutSection from '@common/components/AboutSection';
import EditAboutDialog from './dialogs/EditAboutDialog';
import EditSkillsDialog from './dialogs/EditSkillsDialog';
import EditPortfolioDialog from './dialogs/EditPortfolioDialog';
import EditCertificationsDialog from './dialogs/EditCertificationsDialog';
import EditEmploymentDialog from './dialogs/EditEmploymentDialog';
import EditAchievementsDialog from './dialogs/EditAchievementsDialog';
import EditEquipmentDialog from './dialogs/EditEquipmentDialog';
import EditRegionalExpertiseDialog from './dialogs/EditRegionalExpertiseDialog';
import EditMediaTypesDialog from './dialogs/EditMediaTypesDialog';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import CreatorSkillsSection from '@modules/creators/components/creator-profle/partials/SkillsSection';
import CreatorPortfolioSection from '@modules/creators/components/creator-profle/partials/PortfolioSection';
import CreatorCertificationsSection from '@modules/creators/components/creator-profle/partials/CertificationsSection';
import CreatorAchievementsSection from '@modules/creators/components/creator-profle/partials/AchievementsSection';
import CreatorProfessionalBackgroundSection from '@modules/creators/components/creator-profle/partials/ProfessionalBackgroundSection';
import CreatorMediaTypesSection from '@modules/creators/components/creator-profle/partials/MediaTypesSection';
import CreatorEquipmentInfoSection from '@modules/creators/components/creator-profle/partials/EquipmentInfoSection';
import CreatorRegionalExpertiseSection from '@modules/creators/components/creator-profle/partials/RegionalExpertiseSection';
import { Creator } from '@modules/creators/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';

interface CreatorMainContentProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
}

const CreatorMainContent = ({ user, t, readOnly }: CreatorMainContentProps) => {
  const creator = user.creator as Creator;
  const [openAbout, setOpenAbout] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const [openCertifications, setOpenCertifications] = useState(false);
  const [openEmployment, setOpenEmployment] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openEquipment, setOpenEquipment] = useState(false);
  const [openRegionalExpertise, setOpenRegionalExpertise] = useState(false);
  const [openMediaTypes, setOpenMediaTypes] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate } = useAuth();

  const {
    updateAbout,
    updateSkills,
    updatePortfolio,
    updateCertifications,
    updateEmployment,
    updateAchievements,
    updateEquipment,
    updateRegionalExpertise,
    updateMediaTypes,
  } = useProfileUpdates();

  const handleSaveSkills = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateSkills(user.id, data);
      if (response.success) {
        setOpenSkills(false);
        mutate();
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
        mutate();
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
        mutate();
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
        mutate();
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
        mutate();
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
        mutate();
      }
    } catch (error) {
      console.error('Error saving equipment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRegionalExpertise = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateRegionalExpertise(user.id, data);
      if (response.success) {
        setOpenRegionalExpertise(false);
        mutate();
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
        mutate();
      }
    } catch (error) {
      console.error('Error saving media types data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateAbout(user.id, data);
      if (response.success) {
        setOpenAbout(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={0}>
      {/* About Section */}
      <SectionCard title={t('user:about')} readOnly={readOnly} onEdit={() => setOpenAbout(true)}>
        <AboutSection
          title={user?.profile?.title}
          bio={user?.profile?.bio}
          hourlyRate={user?.creator?.hourlyRate}
          isCreator
        />
      </SectionCard>

      {/* Skills Section */}
      <CreatorSkillsSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenSkills(true)}
      />

      {/* Portfolio Section */}
      <CreatorPortfolioSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenPortfolio(true)}
      />

      {/* Certifications */}
      <CreatorCertificationsSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenCertifications(true)}
      />

      {/* Achievements */}
      <CreatorAchievementsSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenAchievements(true)}
      />

      {/* Professional Background */}
      <CreatorProfessionalBackgroundSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenEmployment(true)}
      />

      {/* Media Types */}
      <CreatorMediaTypesSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenMediaTypes(true)}
      />

      {/* Equipment Info */}
      <CreatorEquipmentInfoSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenEquipment(true)}
      />

      {/* Regional Expertise */}
      <CreatorRegionalExpertiseSection
        creator={creator}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenRegionalExpertise(true)}
      />
      <EditAboutDialog
        user={user}
        open={openAbout}
        onClose={() => setOpenAbout(false)}
        onSave={handleSaveAbout}
        loading={loading}
      />
      <EditSkillsDialog
        user={user}
        open={openSkills}
        onClose={() => setOpenSkills(false)}
        onSave={handleSaveSkills}
        loading={loading}
      />
      <EditPortfolioDialog
        user={user}
        open={openPortfolio}
        onClose={() => setOpenPortfolio(false)}
        onSave={handleSavePortfolio}
        loading={loading}
      />
      <EditCertificationsDialog
        user={user}
        open={openCertifications}
        onClose={() => setOpenCertifications(false)}
        onSave={handleSaveCertifications}
        loading={loading}
      />
      <EditEmploymentDialog
        user={user}
        open={openEmployment}
        onClose={() => setOpenEmployment(false)}
        onSave={handleSaveEmployment}
        loading={loading}
      />
      <EditAchievementsDialog
        user={user}
        open={openAchievements}
        onClose={() => setOpenAchievements(false)}
        onSave={handleSaveAchievements}
        loading={loading}
      />
      <EditEquipmentDialog
        user={user}
        open={openEquipment}
        onClose={() => setOpenEquipment(false)}
        onSave={handleSaveEquipment}
        loading={loading}
      />
      <EditRegionalExpertiseDialog
        user={user}
        open={openRegionalExpertise}
        onClose={() => setOpenRegionalExpertise(false)}
        onSave={handleSaveRegionalExpertise}
        loading={loading}
      />
      <EditMediaTypesDialog
        user={user}
        open={openMediaTypes}
        onClose={() => setOpenMediaTypes(false)}
        onSave={handleSaveMediaTypes}
        loading={loading}
      />
    </Stack>
  );
};

export default CreatorMainContent;
