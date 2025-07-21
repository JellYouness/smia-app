import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import AmbassadorsApiRoutes from '@modules/ambassadors/defs/api-routes';
import { Ambassador } from '@modules/ambassadors/defs/types';
import useApi from '@common/hooks/useApi';

export interface UpdateApplicationStatusInput {
  application_status: string;
  review_notes?: string;
}

export interface UseAmbassadorApplicationsOptions extends UseItemsOptions {
  autoLoad?: boolean;
}

export interface UseAmbassadorApplicationsReturn
  extends ReturnType<UseItems<Ambassador, any, UpdateApplicationStatusInput>> {
  updateApplicationStatus: (id: number, status: string, notes?: string) => Promise<any>;
  getPendingApplications: () => Promise<any>;
}

const useAmbassadorApplications = (opts: UseAmbassadorApplicationsOptions = defaultOptions) => {
  const { autoLoad = true, ...useItemsOptions } = opts;
  const useItemsHook = useItems<Ambassador, any, UpdateApplicationStatusInput>(
    AmbassadorsApiRoutes,
    { ...useItemsOptions, fetchItems: autoLoad }
  );
  const fetchApi = useApi();

  const updateApplicationStatus = async (id: number, status: string, notes?: string) => {
    const response = await fetchApi(
      AmbassadorsApiRoutes.UpdateApplicationStatus.replace('{id}', id.toString()),
      {
        method: 'PATCH',
        data: {
          application_status: status,
          review_notes: notes,
        },
      }
    );

    if (response.success) {
      useItemsHook.mutate();
    }

    return response;
  };

  const getPendingApplications = async () => {
    const response = await fetchApi(AmbassadorsApiRoutes.GetPendingApplications, {
      method: 'GET',
    });

    if (response.success) {
      // Return the data from the response
      return (response as any).data?.data || [];
    }

    return [];
  };

  return {
    ...useItemsHook,
    updateApplicationStatus,
    getPendingApplications,
  } as UseAmbassadorApplicationsReturn;
};

export default useAmbassadorApplications;
