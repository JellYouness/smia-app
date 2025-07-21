import { ProjectUpdate, PROJECT_UPDATE_TYPE } from '../defs/types';
import { ProjectUpdatesApiRoutes } from '../defs/api-routes';
import useItems, { UseItemsOptions, UseItemsHook } from '@common/hooks/useItems';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { Id } from '@common/defs/types';

export interface CreateOneInput {
  projectId: Id;
  clientId?: Id;
  ambassadorId?: Id;
  body: string;
  type: PROJECT_UPDATE_TYPE;
}

export interface UpdateOneInput {
  projectId?: Id;
  clientId?: Id;
  ambassadorId?: Id;
  body?: string;
  type?: PROJECT_UPDATE_TYPE;
}

export type UseProjectUpdatesHook = UseItemsHook<ProjectUpdate, CreateOneInput, UpdateOneInput> & {
  readAllByProject: (
    projectId: Id,
    page?: number,
    pageSize?: number | 'all',
    options?: FetchApiOptions
  ) => Promise<ApiResponse<{ items: ProjectUpdate[]; meta: any }>>;
};

export type UseProjectUpdates = (opts?: UseItemsOptions) => UseProjectUpdatesHook;

const useProjectUpdates: UseProjectUpdates = (opts = {}) => {
  const useItemsHook = useItems<ProjectUpdate, CreateOneInput, UpdateOneInput>(
    ProjectUpdatesApiRoutes,
    opts
  );
  const fetchApi = useApi();

  const readAllByProject = async (
    projectId: Id,
    page?: number,
    pageSize?: number | 'all',
    options?: FetchApiOptions
  ) => {
    const endpoint = ProjectUpdatesApiRoutes.ReadAllByProject.replace(
      '{projectId}',
      projectId.toString()
    );
    const data: Record<string, any> = {};
    if (page) {
      data.page = page;
    }
    if (pageSize) {
      data.perPage = pageSize;
    }
    const response = await fetchApi<{ items: ProjectUpdate[]; meta: any }>(endpoint, {
      method: 'GET',
      data,
      ...options,
    });

    return response;
  };

  return {
    ...useItemsHook,
    readAllByProject,
  };
};

export default useProjectUpdates;
