import Auth from '@modules/auth/defs/routes';
import Users from '@modules/users/defs/routes';
import Posts from '@modules/posts/defs/routes';
import Permissions from '@modules/permissions/defs/routes';
import Projects from '@modules/projects/defs/routes';

const Common = {
  Home: '/',
  NotFound: '/404',
};

const Routes = {
  Common,
  Auth,
  Permissions,
  Users,
  Posts,
  Projects,
};

export default Routes;
