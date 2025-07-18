import { CrudApiRoutes } from '@common/defs/types';

export const ClientsApiRoutes: CrudApiRoutes = {
  CreateOne: '/clients',
  ReadAll: '/clients',
  ReadOne: '/clients/{id}',
  UpdateOne: '/clients/{id}',
  DeleteOne: '/clients/{id}',
};

export default ClientsApiRoutes;
