import { CrudApiRoutes } from '@common/defs/types';

export const SystemAdministratorsApiRoutes: CrudApiRoutes = {
  CreateOne: '/system-administrators',
  ReadAll: '/system-administrators',
  ReadOne: '/system-administrators/{id}',
  UpdateOne: '/system-administrators/{id}',
  DeleteOne: '/system-administrators/{id}',
};

export default SystemAdministratorsApiRoutes;
