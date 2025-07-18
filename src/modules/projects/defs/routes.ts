import { CrudAppRoutes } from '@common/defs/types';

const prefix = '/projects';
const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/edit/{id}',
  DeleteOne: prefix + '/{id}',
  HireCreator: prefix + '/{id}/hire-creator',
};

export default Routes;
