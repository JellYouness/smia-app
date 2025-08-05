import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';

interface ClientProfileData {
  companyName: string;
  companySize: string;
  industry: string;
  websiteUrl: string;
  budget: string;
  projectCount: number;
  billingAddress: string;
  taxIdentifier: string;
  preferredCreators: string[];
  defaultProjectSettings: {
    defaultBudget: string;
    defaultTimeline: string;
    defaultRequirements: string;
  };
  preferredProjectTypes: string[];
  preferredTimeline: string;
}

export const useCompleteClientProfile = () => {
  const { t } = useTranslation(['common', 'client']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeClientProfile = async (data: ClientProfileData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');

      // Parse billing address into components
      const addressParts = data.billingAddress ? data.billingAddress.split(', ') : [];
      const billingStreet = addressParts[0] || '';
      const billingCity = addressParts[1] || '';
      const stateZip = addressParts[2] || '';
      const [billingState, billingPostalCode] = stateZip ? stateZip.split(' ') : ['', ''];
      const billingCountry = addressParts[3] || '';

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/auth/complete-client-profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_name: data.companyName,
            company_size: data.companySize,
            industry: data.industry,
            website_url: data.websiteUrl,
            budget: data.budget,
            project_count: data.projectCount,
            billing_street: billingStreet,
            billing_city: billingCity,
            billing_state: billingState,
            billing_postal_code: billingPostalCode,
            billing_country: billingCountry,
            tax_identifier: data.taxIdentifier,
            preferred_creators: data.preferredCreators?.map((id) => parseInt(id)) || [],
            default_project_settings: {
              timeline: data.defaultProjectSettings.defaultTimeline,
              notification_frequency: 1,
              communication_preference: 'email',
            },
            preferred_project_types: data.preferredProjectTypes || [],
            preferred_timeline: data.preferredTimeline || '',
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        enqueueSnackbar(t('client:client_profile_completed_successfully'), { variant: 'success' });
        router.push(Routes.Users.Me);
      } else {
        enqueueSnackbar(result.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error completing client profile:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    completeClientProfile,
    isSubmitting,
  };
};
