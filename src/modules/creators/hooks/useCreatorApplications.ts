import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import CreatorsApiRoutes from '@modules/creators/defs/api-routes';
import { Creator } from '@modules/creators/defs/types';
import useApi from '@common/hooks/useApi';

export interface UpdateApplicationStatusInput {
  verification_status: string;
  review_notes?: string;
}

export interface UseCreatorApplicationsOptions extends UseItemsOptions {
  autoLoad?: boolean;
}

export interface UseCreatorApplicationsReturn
  extends ReturnType<UseItems<Creator, any, UpdateApplicationStatusInput>> {
  updateApplicationStatus: (id: number, status: string, notes?: string) => Promise<any>;
  getPendingApplications: () => Promise<any>;
}

const useCreatorApplications = (opts: UseCreatorApplicationsOptions = defaultOptions) => {
  const { autoLoad = true, ...useItemsOptions } = opts;
  const useItemsHook = useItems<Creator, any, UpdateApplicationStatusInput>(CreatorsApiRoutes, {
    ...useItemsOptions,
    fetchItems: autoLoad,
  });
  const fetchApi = useApi();

  const updateApplicationStatus = async (id: number, status: string, notes?: string) => {
    const response = await fetchApi(
      CreatorsApiRoutes.UpdateApplicationStatus.replace('{id}', id.toString()),
      {
        method: 'PATCH',
        data: {
          verification_status: status,
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
    const response = await fetchApi(CreatorsApiRoutes.GetPendingApplications, {
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
  } as UseCreatorApplicationsReturn;
};

export default useCreatorApplications;
