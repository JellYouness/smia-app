import { CrudAppRoutes } from '@common/defs/types';

export const ClientsRoutes: CrudAppRoutes = {
  ReadAll: '/admin/clients',
  CreateOne: '/admin/clients/create',
  UpdateOne: '/admin/clients/{id}',
};

export default ClientsRoutes;
