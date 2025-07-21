import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/ambassadors';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  UpdateApplicationStatus: prefix + '/{id}/application-status',
  GetPendingApplications: prefix + '/pending-applications',
};

export default ApiRoutes;
