import {
  MediaPost,
  MEDIA_POST_STATUS,
  MEDIA_POST_PRIORITY,
  MEDIA_POST_ASSIGNMENT_ROLE,
  MEDIA_POST_REVIEW_DECISION,
} from '../defs/types';
import ApiRoutes from '../defs/api-routes';
import useItems, { UseItemsOptions, UseItemsHook } from '@common/hooks/useItems';
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
    input: {
      authorId: Id;
      body: string;
      assetId?: Id;
      timecode?: number;
    },
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  addAssetToMediaPost: (
    postId: Id,
    input: {
      uploadId: Id;
      mimeType: string;
      isReference: boolean;
      uploadedBy: Id;
    },
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  readAllAssetsByPost: (postId: Id, options?: FetchApiOptions) => Promise<ApiResponse<Any>>;
  deleteAssetFromMediaPost: (
    postId: Id,
    assetId: Id,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<Any>>;
  requestReview: (postId: Id, options?: FetchApiOptions) => Promise<ApiResponse<Any>>;
  reviewVersion: (
    postId: Id,
    input: {
      versionId: Id;
      decision: MEDIA_POST_REVIEW_DECISION;
      comment?: string;
    },
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
    input: {
      authorId: Id;
      body: string;
      assetId?: Id;
      timecode?: number;
    },
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

  const addAssetToMediaPost = async (
    postId: Id,
    input: {
      uploadId: Id;
      mimeType: string;
      isReference: boolean;
      uploadedBy: Id;
    },
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.AddAssetToMediaPost.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'POST',
      data: input,
      ...options,
    });

    return response;
  };

  const readAllAssetsByPost = async (postId: Id, options?: FetchApiOptions) => {
    const endpoint = apiRoutes.ReadAllAssetsByPost.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'GET',
      ...options,
    });

    return response;
  };

  const deleteAssetFromMediaPost = async (postId: Id, assetId: Id, options?: FetchApiOptions) => {
    const endpoint = apiRoutes.DeleteAssetFromMediaPost.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'DELETE',
      data: { assetId },
      ...options,
    });

    return response;
  };

  const requestReview = async (postId: Id, options?: FetchApiOptions) => {
    const endpoint = apiRoutes.RequestReview.replace('{postId}', postId.toString());
    const response = await fetchApi(endpoint, {
      method: 'POST',
      ...options,
    });

    return response;
  };

  const reviewVersion = async (
    postId: Id,
    input: {
      versionId: Id;
      decision: MEDIA_POST_REVIEW_DECISION;
      comment?: string;
    },
    options?: FetchApiOptions
  ) => {
    const endpoint = apiRoutes.ReviewVersion.replace('{postId}', postId.toString());
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
    addAssetToMediaPost,
    readAllAssetsByPost,
    deleteAssetFromMediaPost,
    requestReview,
    reviewVersion,
  };

  return hook;
};

export default useMedia;
