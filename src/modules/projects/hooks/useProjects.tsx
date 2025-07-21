import ApiRoutes from '@common/defs/api-routes';
import {
  Project,
  PROJECT_CREATOR_PERMISSION,
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
import { mutate } from 'swr';

// Cache key helper for project data
export const projectCacheKey = (id: Id) => ['/projects', id];

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
  readAllProposalsByProject: (
    projectId: Id,
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
  approveProposal: (proposalId: Id, options?: FetchApiOptions) => Promise<ApiResponse<Any>>;
  declineProposal: (proposalId: Id, options?: FetchApiOptions) => Promise<ApiResponse<Any>>;
  updateCreatorPermission: (
    projectId: Id,
    creatorId: Id,
    permission: PROJECT_CREATOR_PERMISSION,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  readAllPublicProjects: (
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

  const readAllProposalsByProject = async (
    projectId: Id,
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = ApiRoutes.Projects.ReadAllProposalsByProject.replace(
      '{projectId}',
      projectId.toString()
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

  const approveProposal = async (proposalId: Id, options?: FetchApiOptions) => {
    // Note: This would need projectId to be passed or extracted from the proposal
    // For now, we'll just revalidate all project caches
    const endpoint = ApiRoutes.Projects.ApproveProposal.replace(
      '{proposalId}',
      proposalId.toString()
    );
    const response = await fetchApi(endpoint, {
      method: 'PATCH',
      data: { status: 'ACCEPTED' },
      ...options,
    });

    // Revalidate all project caches since proposal status affects project counts
    // In a real implementation, you'd want to pass projectId and use projectCacheKey(projectId)
    mutate((key) => Array.isArray(key) && key[0] === '/projects');

    return response;
  };

  const declineProposal = async (proposalId: Id, options?: FetchApiOptions) => {
    // Note: This would need projectId to be passed or extracted from the proposal
    // For now, we'll just revalidate all project caches
    const endpoint = ApiRoutes.Projects.DeclineProposal.replace(
      '{proposalId}',
      proposalId.toString()
    );
    const response = await fetchApi(endpoint, {
      method: 'PATCH',
      data: { status: 'DECLINED' },
      ...options,
    });

    // Revalidate all project caches since proposal status affects project counts
    // In a real implementation, you'd want to pass projectId and use projectCacheKey(projectId)
    mutate((key) => Array.isArray(key) && key[0] === '/projects');

    return response;
  };

  const updateCreatorPermission = async (
    projectId: Id,
    creatorId: Id,
    permission: PROJECT_CREATOR_PERMISSION,
    options?: FetchApiOptions
  ) => {
    // 2.1 optimistic update
    mutate(
      projectCacheKey(projectId),
      (prev?: ApiResponse<{ item: Project }>) => {
        if (!prev?.data?.item) {
          return prev;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            item: {
              ...prev.data.item,
              projectCreators:
                prev.data.item.projectCreators?.map((pc) =>
                  pc.creatorId === creatorId ? { ...pc, permission } : pc
                ) || [],
            },
          },
        };
      },
      false // skip re-validation for instant paint
    );

    // 2.2 real API call
    const endpoint = ApiRoutes.Projects.UpdateCreatorPermission.replace(
      '{id}',
      projectId.toString()
    ).replace('{creatorId}', creatorId.toString());
    const response = await fetchApi(endpoint, {
      method: 'PATCH',
      data: { permission },
      ...options,
    });

    // 2.3 hard re-validate on success/failure to keep source-of-truth
    mutate(projectCacheKey(projectId));

    return response;
  };

  const readAllPublicProjects = async (
    page?: number,
    pageSize?: number | 'all',
    columnsSort?: SortParam,
    filters?: FilterParam[],
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.ReadAllPublic;
    const data: Record<string, Any> = {
      page: page || 1,
      perPage: pageSize || 50,
    };
    if (columnsSort) {
      data['order[column]'] = columnsSort.column;
      data['order[dir]'] = columnsSort.dir;
    }
    if (filters && filters.length > 0) {
      data.filters = JSON.stringify(filters); // Serialize filters as JSON string
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
    inviteCreator,
    readAllInvitesByCreator,
    declineInvite,
    acceptInvite,
    readAllProposalsByCreator,
    readAllProposalsByProject,
    addCommentToProposal,
    readAllCommentsByProposal,
    approveProposal,
    declineProposal,
    updateCreatorPermission,
    readAllPublicProjects, // <-- add here
  };

  return hook;
};

export default useProjects;
