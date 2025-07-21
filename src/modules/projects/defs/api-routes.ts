import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/projects';
const projectUpdatesPrefix = '/project-updates';

const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllByCreator: prefix + '/creator/{creatorId}',
  ReadAllByClient: prefix + '/client/{clientId}',
  ReadAllByAmbassador: prefix + '/ambassador/{ambassadorId}',
  ReadAllPublic: prefix + '/public',

  InviteCreator: prefix + '/invite-creator',
  ReadAllInvitesByCreator: prefix + '/invites/creator/{creatorId}',
  DeclineInvite: prefix + '/invites/{id}/decline',
  AcceptInvite: prefix + '/invites/{id}/accept',

  ReadAllProposalsByCreator: prefix + '/proposals/creator/{creatorId}',
  ReadAllProposalsByProject: prefix + '/proposals/project/{projectId}',
  AddProposalComment: prefix + '/proposals/{proposalId}/comments',
  ReadAllCommentsByProposal: prefix + '/proposals/{proposalId}/comments',
  ApproveProposal: prefix + '/proposals/{proposalId}/approve',
  DeclineProposal: prefix + '/proposals/{proposalId}/decline',
  UpdateCreatorPermission: prefix + '/{id}/creators/{creatorId}/permission',
};

export const ProjectUpdatesApiRoutes = {
  CreateOne: projectUpdatesPrefix,
  ReadAll: projectUpdatesPrefix,
  ReadOne: projectUpdatesPrefix + '/{id}',
  UpdateOne: projectUpdatesPrefix + '/{id}',
  DeleteOne: projectUpdatesPrefix + '/{id}',
  ReadAllByProject: projectUpdatesPrefix + '/project/{projectId}',
};

export default ApiRoutes;
