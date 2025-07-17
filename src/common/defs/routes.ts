import Auth from '@modules/auth/defs/routes';
import Users from '@modules/users/defs/routes';
import Posts from '@modules/posts/defs/routes';
import Permissions from '@modules/permissions/defs/routes';
import Creators from '@modules/creators/defs/routes';
import Clients from '@modules/clients/defs/routes';
import Ambassadors from '@modules/ambassadors/defs/routes';
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
  Creators,
  Clients,
  Ambassadors,
  Projects,
};

export default Routes;
