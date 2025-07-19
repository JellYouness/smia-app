import { CrudAppRoutes } from '@common/defs/types';

export const CreatorsRoutes: CrudAppRoutes = {
  ReadOne: '/creators/{id}',
  ReadAll: '/admin/creators',
  CreateOne: '/admin/creators/create',
  UpdateOne: '/admin/creators/{id}',
};

export default CreatorsRoutes;
