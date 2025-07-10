import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/users';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  // Profile section specific routes
  UpdateAbout: prefix + '/{id}/about',
  UpdatePortfolio: prefix + '/{id}/portfolio',
  UpdateSkills: prefix + '/{id}/skills',
  UpdateCertifications: prefix + '/{id}/certifications',
  UpdateEmployment: prefix + '/{id}/employment',
  UpdateAchievements: prefix + '/{id}/achievements',
  UpdateEquipment: prefix + '/{id}/equipment',
  UpdateRegionalExpertise: prefix + '/{id}/regional-expertise',
  UpdateMediaTypes: prefix + '/{id}/media-types',
  UpdateLanguages: prefix + '/{id}/languages',
  UpdateEducation: prefix + '/{id}/education',
  // Client-specific routes
  UpdateCompany: prefix + '/{id}/company',
  UpdateBilling: prefix + '/{id}/billing',
  UpdateBudget: prefix + '/{id}/budget',
  UpdateProjectSettings: prefix + '/{id}/project-settings',
};

export default ApiRoutes;
