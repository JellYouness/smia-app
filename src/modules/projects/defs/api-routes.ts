import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/projects';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllByCreator: prefix + '/creator/{creatorId}',
  ReadAllByClient: prefix + '/client/{clientId}',
  ReadAllByAmbassador: prefix + '/ambassador/{ambassadorId}',
};

export default ApiRoutes;
