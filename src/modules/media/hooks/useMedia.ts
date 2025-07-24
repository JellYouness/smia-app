import {
  MediaPost,
  MEDIA_POST_STATUS,
  MEDIA_POST_PRIORITY,
  MediaPostAssignment,
  MEDIA_POST_ASSIGNMENT_ROLE,
} from '../defs/types';
import ApiRoutes from '../defs/api-routes';
import useItems, {
  UseItemsOptions,
  UseItemsHook,
  UseItems,
  defaultOptions,
} from '@common/hooks/useItems';
import { Any, Id } from '@common/defs/types';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { mutate } from 'swr';

export interface CreateOneInput {
  title: string;
  description: string;
  status?: MEDIA_POST_STATUS;
  priority?: MEDIA_POST_PRIORITY;
  dueDate?: string;
  projectId: Id;
}

export interface UpdateOneInput {
  title?: string;
  description?: string;
  status?: MEDIA_POST_STATUS;
  priority?: MEDIA_POST_PRIORITY;
  dueDate?: string;
  projectId?: Id;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

export type UseMediaHook = UseItemsHook<MediaPost, CreateOneInput, UpdateOneInput> & {
  upsertAssignee: (
    postId: Id,
    input: {
      creatorId: Id;
      role: MEDIA_POST_ASSIGNMENT_ROLE;
    },
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  deleteAssignee: (
    postId: Id,
    creatorId: Id,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  addComment: (
    postId: Id,
    input: { authorId: Id; body: string; assetId?: Id; timecode?: number },
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
};

export type UseMedia = (opts?: UseItemsOptions) => UseMediaHook;

const useMedia: UseMedia = (opts = {}) => {
  const apiRoutes = ApiRoutes;
  const useItemsHook = useItems<MediaPost, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  const fetchApi = useApi();

  const upsertAssignee = async (
    postId: Id,
    input: {
      creatorId: Id;
      role: MEDIA_POST_ASSIGNMENT_ROLE;
    },
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.UpsertAssignee.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'POST',
      data: input,
      ...options,
    });

    if (response.success) {
      mutate((key) => Array.isArray(key) && key[0] === '/media_posts');
    }

    return response;
  };

  const deleteAssignee = async (postId: Id, creatorId: Id, options?: FetchApiOptions) => {
    const endpoint = apiRoutes.DeleteAssignee.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'DELETE',
      data: { creatorId },
      ...options,
    });

    if (response.success) {
      mutate((key) => Array.isArray(key) && key[0] === '/media_posts');
    }

    return response;
  };

  const addComment = async (
    postId: Id,
    input: { authorId: Id; body: string; assetId?: Id; timecode?: number },
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.AddComment.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'POST',
      data: input,
      ...options,
    });

    return response;
  };

  const hook: UseMediaHook = {
    ...useItemsHook,
    upsertAssignee,
    deleteAssignee,
    addComment,
  };

  return hook;
};

export default useMedia;
