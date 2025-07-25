const prefix = '/auth';
const ApiRoutes = {
  Login: prefix + '/login',
  Register: prefix + '/register',
  Logout: prefix + '/logout',
  RequestPasswordReset: prefix + '/request-password-reset',
  ResetPassword: prefix + '/reset-password',
  ResendEmailVerification: prefix + '/resend-email-verification',
  VerifyEmail: prefix + '/verify-email',
  Me: prefix + '/me',
  UpdateProfile: prefix + '/profile',
};

export default ApiRoutes;
