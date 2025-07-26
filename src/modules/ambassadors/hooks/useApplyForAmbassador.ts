import useApi from '@common/hooks/useApi';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import AmbassadorsApiRoutes from '../defs/api-routes';

export interface ApplyForAmbassadorInput {
  teamMembers: number[];
  teamName: string;
  specializations: string[];
  regionalExpertise: Array<{
    region: string;
    proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  }>;
  serviceOfferings: string[];
  teamDescription: string;
  yearsInBusiness: number;
  businessStreet: string;
  businessCity: string;
  businessState: string;
  businessPostalCode: string;
  businessCountry: string;
}

const useApplyForAmbassador = () => {
  const fetchApi = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['common', 'user']);

  const applyForAmbassador = async (data: ApplyForAmbassadorInput) => {
    try {
      const response = await fetchApi(AmbassadorsApiRoutes.ApplyForAmbassador, {
        method: 'POST',
        data,
        displaySuccess: true,
      });

      if (response.success) {
        enqueueSnackbar(
          t('user:ambassador_application_submitted') ||
            'Ambassador application submitted successfully',
          {
            variant: 'success',
          }
        );
      }

      return response;
    } catch (error) {
      console.error('Error applying for ambassador:', error);
      enqueueSnackbar(t('common:error_occurred') || 'An error occurred', {
        variant: 'error',
      });
      return { success: false, errors: [t('common:error_occurred') || 'An error occurred'] };
    }
  };

  return {
    applyForAmbassador,
  };
};

export default useApplyForAmbassador;
