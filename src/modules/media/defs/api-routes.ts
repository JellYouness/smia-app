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
};

export default ApiRoutes;
