import Auth from '@modules/auth/defs/api-routes';
import Users from '@modules/users/defs/api-routes';
import Uploads from '@modules/uploads/defs/api-routes';
import Posts from '@modules/posts/defs/api-routes';
import Projects from '@modules/projects/defs/api-routes';
import Creators from '@modules/creators/defs/api-routes';

const API_ROUTES = {
  Auth,
  Users,
  Uploads,
  Posts,
  Projects,
  Creators,
  SAVED_PROFILES: {
    LIST: '/saved-profiles',
    SAVE: '/saved-profiles',
    UNSAVE: (creatorId: number | string) => `/saved-profiles/${creatorId}`,
    SHOW: (creatorId: number | string) => `/saved-profiles/${creatorId}`,
  },
};

export default API_ROUTES;
