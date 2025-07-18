import { CrudAppRoutes } from '@common/defs/types';

export const SystemAdministratorsRoutes: CrudAppRoutes = {
  ReadAll: '/admin/system-administrators',
  CreateOne: '/admin/system-administrators/create',
  UpdateOne: '/admin/system-administrators/{id}',
};

export default SystemAdministratorsRoutes;
