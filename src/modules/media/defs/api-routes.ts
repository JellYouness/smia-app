import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/media_posts';

const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',

  UpsertAssignee: prefix + '/{postId}/upsert_creator',
  DeleteAssignee: prefix + '/{postId}/delete_creator',
  AddComment: prefix + '/{postId}/add_comment',

  AddAssetToMediaPost: prefix + '/{postId}/add_asset',
  ReadAllAssetsByPost: prefix + '/{postId}/assets',
  DeleteAssetFromMediaPost: prefix + '/{postId}/delete_asset',

  RequestReview: prefix + '/{postId}/request_review',
  ReviewVersion: prefix + '/{postId}/review_version',
};

export default ApiRoutes;
