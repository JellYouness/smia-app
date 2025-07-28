import useApi from '@common/hooks/useApi';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Ambassador } from '../defs/types';
import AmbassadorsApiRoutes from '../defs/api-routes';
import useItems from '@common/hooks/useItems';

export interface UpdateAmbassadorInput {
  teamMembers?: number[];
  teamName?: string;
  specializations?: string[];
  regionalExpertise?: Array<{
    region: string;
    proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  }>;
  serviceOfferings?: string[];
  clientCount?: number;
  projectCapacity?: number;
  verificationDocuments?: string[];
  commissionRate?: number;
  teamDescription?: string;
  featuredWork?: Array<{
    projectId: number;
    description: string;
  }>;
  yearsInBusiness?: number;
  businessStreet?: string;
  businessCity?: string;
  businessState?: string;
  businessPostalCode?: string;
  businessCountry?: string;
}

const useAmbassador = () => {
  const fetchApi = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['common']);

  const updateAmbassador = async (id: number, data: UpdateAmbassadorInput) => {
    try {
      const response = await fetchApi<{ item: Ambassador }>(
        AmbassadorsApiRoutes.UpdateOne.replace('{id}', id.toString()),
        {
          method: 'PUT',
          data,
          displaySuccess: true,
        }
      );

      if (response.success) {
        enqueueSnackbar(t('common:updated_successfully') || 'Updated successfully', {
          variant: 'success',
        });
      }

      return response;
    } catch (error) {
      console.error('Error updating ambassador:', error);
      enqueueSnackbar(t('common:error_occurred') || 'An error occurred', {
        variant: 'error',
      });
      return { success: false, errors: [t('common:error_occurred') || 'An error occurred'] };
    }
  };

  const patchAmbassador = async (id: number, data: Partial<UpdateAmbassadorInput>) => {
    try {
      const response = await fetchApi<{ item: Ambassador }>(
        AmbassadorsApiRoutes.UpdateOne.replace('{id}', id.toString()),
        {
          method: 'PATCH',
          data,
          displaySuccess: true,
        }
      );

      if (response.success) {
        enqueueSnackbar(t('common:updated_successfully') || 'Updated successfully', {
          variant: 'success',
        });
      }

      return response;
    } catch (error) {
      console.error('Error updating ambassador:', error);
      enqueueSnackbar(t('common:error_occurred') || 'An error occurred', {
        variant: 'error',
      });
      return { success: false, errors: [t('common:error_occurred') || 'An error occurred'] };
    }
  };

  return {
    ...useItems<Ambassador, UpdateAmbassadorInput, UpdateAmbassadorInput>(AmbassadorsApiRoutes),
    updateAmbassador,
    patchAmbassador,
  };
};

export default useAmbassador;
