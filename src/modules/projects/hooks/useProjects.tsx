import ApiRoutes from '@common/defs/api-routes';
import {
  Project,
  PROJECT_STATUS,
  ProjectInvite,
  ProjectProposal,
  ProjectProposalComment,
} from '../defs/types';
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
import { Any, Id } from '@common/defs/types';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';

export interface CreateOneInput {
  title: string;
  description: string;
  status?: PROJECT_STATUS;
  startDate: string;
  endDate: string;
  budget: number;
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

export interface InviteCreatorInput {
  projectId: Id;
  creatorId: Id;
  message?: string;
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
  inviteCreator: (
    input: InviteCreatorInput,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  readAllInvitesByCreator: (
    creatorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => Promise<ItemsResponse<ProjectInvite>>;
  declineInvite: (inviteId: Id, options?: FetchApiOptions) => Promise<ApiResponse<Any>>;
  acceptInvite: (
    inviteId: Id,
    input: {
      amount?: number;
      currency?: string;
      duration_days?: number;
      cover_letter?: string;
      attachments?: Any[];
      meta?: Any;
    },
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  readAllProposalsByCreator: (
    creatorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => Promise<ItemsResponse<ProjectProposal>>;
  addCommentToProposal: (
    proposalId: Id,
    input: {
      body: string;
      parentId?: Id;
      attachments?: Any[];
    },
    options?: FetchApiOptions
  ) => Promise<ApiResponse<ProjectProposalComment>>;
  readAllCommentsByProposal: (
    proposalId: Id,
    options?: FetchApiOptions
  ) => Promise<ItemsResponse<ProjectProposalComment>>;
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
    const data: Record<string, Any> = {
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
    const data: Record<string, Any> = {
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
    const data: Record<string, Any> = {
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

  const inviteCreator = async (input: InviteCreatorInput, options?: FetchApiOptions) => {
    const endpoint = ApiRoutes.Projects.InviteCreator;
    const response = await fetchApi(endpoint, {
      method: 'POST',
      data: {
        project_id: input.projectId,
        creator_id: input.creatorId,
        message: input.message ?? null,
      },
      ...options,
    });
    return response;
  };

  const readAllInvitesByCreator = async (
    creatorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = ApiRoutes.Projects.ReadAllInvitesByCreator.replace(
      '{creatorId}',
      creatorId.toString()
    );

    const data: Record<string, Any> = {
      page: page ?? 1,
      perPage: pageSize ?? 50,
    };

    if (columnsSort) {
      data['order[column]'] = columnsSort.column;
      data['order[dir]'] = columnsSort.dir;
    }
    if (filters?.length) {
      data.filters = filters;
    }

    const response = await fetchApi<ItemsData<ProjectInvite>>(endpoint, {
      method: 'GET',
      data,
      ...options,
    });
    return response;
  };

  const declineInvite = async (inviteId: Id, options?: FetchApiOptions) => {
    const endpoint = ApiRoutes.Projects.DeclineInvite.replace('{id}', inviteId.toString());

    const response = await fetchApi(endpoint, {
      method: 'PATCH',
      data: { status: 'DECLINED' },
      ...options,
    });

    return response;
  };

  const acceptInvite = async (
    inviteId: Id,
    input: {
      amount?: number;
      currency?: string;
      duration_days?: number;
      cover_letter?: string;
      attachments?: Any[];
      meta?: Any;
    },
    options?: FetchApiOptions
  ) => {
    const endpoint = ApiRoutes.Projects.AcceptInvite.replace('{id}', inviteId.toString());

    const data = {
      invite_id: inviteId,
      ...input,
    };

    const response = await fetchApi(endpoint, {
      method: 'POST',
      data,
      ...options,
    });

    return response;
  };

  const readAllProposalsByCreator = async (
    creatorId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = ApiRoutes.Projects.ReadAllProposalsByCreator.replace(
      '{creatorId}',
      creatorId.toString()
    );

    const data: Record<string, Any> = {
      page,
      perPage: pageSize,
    };
    if (columnsSort) {
      data['order[column]'] = columnsSort.column;
      data['order[dir]'] = columnsSort.dir;
    }
    if (filters?.length) {
      data.filters = filters;
    }

    const response = await fetchApi<ItemsData<ProjectProposal>>(endpoint, {
      method: 'GET',
      data,
      ...options,
    });

    return response;
  };

  const addCommentToProposal = async (
    proposalId: Id,
    input: { body: string; parentId?: Id; attachments?: Any[] },
    options?: FetchApiOptions
  ) => {
    const endpoint = ApiRoutes.Projects.AddProposalComment.replace(
      '{proposalId}',
      proposalId.toString()
    );

    const response = await fetchApi<ProjectProposalComment>(endpoint, {
      method: 'POST',
      data: {
        body: input.body,
        parent_id: input.parentId ?? null,
        attachments: input.attachments ?? null,
      },
      ...options,
    });

    return response;
  };

  const readAllCommentsByProposal = async (proposalId: Id, options?: FetchApiOptions) => {
    const endpoint = ApiRoutes.Projects.ReadAllCommentsByProposal.replace(
      '{proposalId}',
      proposalId.toString()
    );

    const response = await fetchApi<ItemsData<ProjectProposalComment>>(endpoint, {
      method: 'GET',
      ...options,
    });

    return response;
  };

  const hook: UseProjectsHook = {
    ...useItemsHook,
    readAllByCreator,
    readAllByClient,
    readAllByAmbassador,
    inviteCreator,
    readAllInvitesByCreator,
    declineInvite,
    acceptInvite,
    readAllProposalsByCreator,
    addCommentToProposal,
    readAllCommentsByProposal,
  };

  return hook;
};

export default useProjects;
