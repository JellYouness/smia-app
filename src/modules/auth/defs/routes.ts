const prefix = '/auth';
const Routes = {
  Login: prefix + '/login',
  Register: prefix + '/register',
  RegisterClient: prefix + '/register/client',
  RegisterCreator: prefix + '/register/creator',
  RequestPasswordReset: prefix + '/request-password-reset',
  CompleteProfile: prefix + '/complete-profile',
  CompleteRoleProfile: prefix + '/complete-role-profile',
  VerifyEmail: prefix + '/verify-email',
};

export default Routes;
