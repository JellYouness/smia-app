import { CrudApiRoutes } from '@common/defs/types';

export const CreatorsApiRoutes: CrudApiRoutes = {
  CreateOne: '/creators',
  ReadAll: '/creators',
  ReadOne: '/creators/{id}',
  UpdateOne: '/creators/{id}',
  DeleteOne: '/creators/{id}',
};

export default CreatorsApiRoutes;
