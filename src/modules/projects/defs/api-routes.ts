import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/projects';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  ReadAllByCreator: prefix + '/creator/{creatorId}',
  ReadAllByClient: prefix + '/client/{clientId}',
  ReadAllByAmbassador: prefix + '/ambassador/{ambassadorId}',

  InviteCreator: prefix + '/invite-creator',
  ReadAllInvitesByCreator: prefix + '/invites/creator/{creatorId}',
  DeclineInvite: prefix + '/invites/{id}/decline',
  AcceptInvite: prefix + '/invites/{id}/accept',

  ReadAllProposalsByCreator: prefix + '/proposals/creator/{creatorId}',
  AddProposalComment: prefix + '/proposals/{proposalId}/comments',
  ReadAllCommentsByProposal: prefix + '/proposals/{proposalId}/comments',
};

export default ApiRoutes;
