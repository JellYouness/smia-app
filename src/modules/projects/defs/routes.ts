import { CrudAppRoutes } from '@common/defs/types';

const prefix = '/projects';
const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllByCreator: prefix + '/creator/{creatorId}',
  ReadAllByClient: prefix + '/client/{clientId}',
  ReadAllByAmbassador: prefix + '/ambassador/{ambassadorId}',
};

export default Routes;
