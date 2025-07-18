import { CrudAppRoutes } from '@common/defs/types';

export const AmbassadorsRoutes: CrudAppRoutes = {
  ReadAll: '/admin/ambassadors',
  CreateOne: '/admin/ambassadors/create',
  UpdateOne: '/admin/ambassadors/{id}',
};

export default AmbassadorsRoutes;
