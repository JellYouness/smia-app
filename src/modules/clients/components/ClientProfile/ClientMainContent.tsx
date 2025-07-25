import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { Any } from '@common/defs/types';
import SectionCard from '@modules/users/components/SectionCard';
import EditAboutDialog from '@modules/creators/components/CreatorProfle/EditAboutDialog';
import EditCompanyDialog from '@modules/clients/components/ClientProfile/EditCompanyDialog';
import EditBillingDialog from '@modules/clients/components/ClientProfile/EditBillingDialog';
import EditBudgetProjectsDialog from './EditBudgetProjectsDialog';
import EditDefaultProjectSettingsDialog from './EditDefaultProjectSettingsDialog';
import EditContactInfoDialog from './EditContactInfoDialog';
import AboutSection from '@common/components/AboutSection';

import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';
import { User } from '@modules/users/defs/types';
import { TFunction } from 'i18next';
import CompanyInfoSection from './proflle-components/CompanyInfoSection';
import BillingInfoSection from './proflle-components/BillingInfoSection';
import BudgetProjectsSection from './proflle-components/BudgetProjectsSection';
import DefaultProjectSettingsSection from './proflle-components/DefaultProjectSettingsSection';
import ContactInfoSection from './proflle-components/ContactInfoSection';
import AdditionalInfoSection from './proflle-components/AdditionalInfoSection';

interface ClientMainContentProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
}

const ClientMainContent = ({ user, t, readOnly }: ClientMainContentProps) => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openBudgetProjects, setOpenBudgetProjects] = useState(false);
  const [openDefaultProjectSettings, setOpenDefaultProjectSettings] = useState(false);
  const [openContactInfo, setOpenContactInfo] = useState(false);

  const {
    updateAbout,
    updateCompany,
    updateBilling,
    updateBudgetProjects,
    updateDefaultProjectSettings,
    updateContactInfo,
  } = useProfileUpdates();

  const handleSaveAbout = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateAbout(user.id, data);
      if (response.success) {
        setOpenAbout(false);
      }
    } catch (error) {
      console.error('Error saving about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateCompany(user.id, {
        company_name: data.companyName,
        company_size: data.companySize,
        industry: data.industry,
        website_url: data.websiteUrl,
      });
      if (response.success) {
        setOpenCompany(false);
      }
    } catch (error) {
      console.error('Error saving company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBilling = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateBilling(user.id, {
        billing_street: data.billingStreet,
        billing_city: data.billingCity,
        billing_state: data.billingState,
        billing_postal_code: data.billingPostalCode,
        billing_country: data.billingCountry,
        tax_identifier: data.taxIdentifier,
      });
      if (response.success) {
        setOpenBilling(false);
      }
    } catch (error) {
      console.error('Error saving billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudgetProjects = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateBudgetProjects(user.id, {
        budget: data.budget, // pass as string
        projectCount: Number(data.projectCount),
        preferredCreators: data.preferredCreators,
      });
      if (response.success) {
        setOpenBudgetProjects(false);
      }
    } catch (error) {
      console.error('Error saving budget & projects data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDefaultProjectSettings = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateDefaultProjectSettings(user.id, data);
      if (response.success) {
        setOpenDefaultProjectSettings(false);
      }
    } catch (error) {
      console.error('Error saving default project settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContactInfo = async (data: Any) => {
    try {
      setLoading(true);
      const response = await updateContactInfo(user.id, data);
      if (response.success) {
        setOpenContactInfo(false);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={0}>
      {/* Title/About Section */}
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
      <CompanyInfoSection user={user} readOnly={readOnly} onEdit={() => setOpenCompany(true)} />
      <EditCompanyDialog
        user={user}
        open={openCompany}
        onClose={() => setOpenCompany(false)}
        onSave={handleSaveCompany}
        loading={loading}
      />
      <BillingInfoSection user={user} readOnly={readOnly} onEdit={() => setOpenBilling(true)} />
      <EditBillingDialog
        user={user}
        open={openBilling}
        onClose={() => setOpenBilling(false)}
        onSave={handleSaveBilling}
        loading={loading}
      />
      <BudgetProjectsSection
        user={user}
        readOnly={readOnly}
        onEdit={() => setOpenBudgetProjects(true)}
      />
      <EditBudgetProjectsDialog
        user={user}
        open={openBudgetProjects}
        onClose={() => setOpenBudgetProjects(false)}
        onSave={handleSaveBudgetProjects}
        loading={loading}
      />
      <DefaultProjectSettingsSection
        user={user}
        readOnly={readOnly}
        onEdit={() => setOpenDefaultProjectSettings(true)}
      />
      <EditDefaultProjectSettingsDialog
        user={user}
        open={openDefaultProjectSettings}
        onClose={() => setOpenDefaultProjectSettings(false)}
        onSave={handleSaveDefaultProjectSettings}
        loading={loading}
      />
      <ContactInfoSection user={user} readOnly={readOnly} onEdit={() => setOpenContactInfo(true)} />
      <EditContactInfoDialog
        user={user}
        open={openContactInfo}
        onClose={() => setOpenContactInfo(false)}
        onSave={handleSaveContactInfo}
        loading={loading}
      />
      <AdditionalInfoSection user={user} readOnly={readOnly} />
    </Stack>
  );
};

export default ClientMainContent;
