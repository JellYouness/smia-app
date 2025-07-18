import { CrudApiRoutes } from '@common/defs/types';

export const AmbassadorsApiRoutes: CrudApiRoutes = {
  CreateOne: '/ambassadors',
  ReadAll: '/ambassadors',
  ReadOne: '/ambassadors/{id}',
  UpdateOne: '/ambassadors/{id}',
  DeleteOne: '/ambassadors/{id}',
};

export default AmbassadorsApiRoutes;
