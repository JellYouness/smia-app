import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/uploads';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  DownloadFile: prefix + '/download/{id}',
};

export default ApiRoutes;
