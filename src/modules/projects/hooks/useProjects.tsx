import ApiRoutes from '@common/defs/api-routes';
import { Project, PROJECT_STATUS } from '../defs/types';
import useItems, {
  UseItems,
  UseItemsHook,
  UseItemsOptions,
  defaultOptions,
  ItemsResponse,
  ItemsData,
  SortParam,
  FilterParam,
} from '@common/hooks/useItems';
import { Id } from '@common/defs/types';
import useApi, { FetchApiOptions } from '@common/hooks/useApi';

export interface CreateOneInput {
  title: string;
  description?: string;
  status: PROJECT_STATUS;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId?: Id;
  creatorId?: Id;
  ambassadorId?: Id;
}

export interface UpdateOneInput {
  title?: string;
  description?: string;
  status?: PROJECT_STATUS;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId?: Id;
  creatorId?: Id;
  ambassadorId?: Id;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

export interface UseProjectsHook extends UseItemsHook<Project, CreateOneInput, UpdateOneInput> {
  readAllByCreator: (
    creatorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => Promise<ItemsResponse<Project>>;
  readAllByClient: (
    clientId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => Promise<ItemsResponse<Project>>;
  readAllByAmbassador: (
    ambassadorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => Promise<ItemsResponse<Project>>;
}

export type UseProjects = (opts?: UseItemsOptions) => UseProjectsHook;

const useProjects: UseProjects = (opts: UseItemsOptions = defaultOptions) => {
  const apiRoutes = ApiRoutes.Projects;
  const useItemsHook = useItems<Project, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  const fetchApi = useApi();

  const readAllByCreator = async (
    creatorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.ReadAllByCreator.replace('{creatorId}', creatorId.toString());
    const data: Record<string, any> = {
      page: page || 1,
      perPage: pageSize || 50,
    };
    if (columnsSort) {
      data['order[column]'] = columnsSort.column;
      data['order[dir]'] = columnsSort.dir;
    }
    if (filters && filters.length > 0) {
      data.filters = filters;
    }
    const response = await fetchApi<ItemsData<Project>>(endpoint, {
      method: 'GET',
      data,
      ...options,
    });
    return response;
  };

  const readAllByClient = async (
    clientId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.ReadAllByClient.replace('{clientId}', clientId.toString());
    const data: Record<string, any> = {
      page: page || 1,
      perPage: pageSize || 50,
    };
    if (columnsSort) {
      data['order[column]'] = columnsSort.column;
      data['order[dir]'] = columnsSort.dir;
    }
    if (filters && filters.length > 0) {
      data.filters = filters;
    }
    const response = await fetchApi<ItemsData<Project>>(endpoint, {
      method: 'GET',
      data,
      ...options,
    });
    return response;
  };

  const readAllByAmbassador = async (
    ambassadorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.ReadAllByAmbassador.replace(
      '{ambassadorId}',
      ambassadorId.toString()
    );
    const data: Record<string, any> = {
      page: page || 1,
      perPage: pageSize || 50,
    };
    if (columnsSort) {
      data['order[column]'] = columnsSort.column;
      data['order[dir]'] = columnsSort.dir;
    }
    if (filters && filters.length > 0) {
      data.filters = filters;
    }
    const response = await fetchApi<ItemsData<Project>>(endpoint, {
      method: 'GET',
      data,
      ...options,
    });
    return response;
  };

  const hook: UseProjectsHook = {
    ...useItemsHook,
    readAllByCreator,
    readAllByClient,
    readAllByAmbassador,
  };

  return hook;
};

export default useProjects;
