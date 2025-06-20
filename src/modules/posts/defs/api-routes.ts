import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/articles'; // posts
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllByUser: prefix + '/user/{userId}',
};

export default ApiRoutes;
