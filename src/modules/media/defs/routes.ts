import { CrudAppRoutes } from '@common/defs/types';

const prefix = '/media';
const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/edit/{id}',
  DeleteOne: prefix + '/{id}',
};

export default Routes;
