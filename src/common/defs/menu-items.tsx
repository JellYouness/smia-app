import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import { Group, Star, Settings, School, AdminPanelSettings } from '@mui/icons-material';
import Namespaces from './namespaces';

export const menuItems: NavGroup[] = [
  {
    text: 'Gestion',
    items: [
      {
        text: 'Dashboard',
        icon: <DashboardCustomizeRoundedIcon />,
        link: Routes.Common.Home,
      },
      {
        text: 'Creators',
        icon: <Star />,
        link: '/admin/creators',
        permission: CRUD_ACTION.READ,
        namespace: Namespaces.Creators,
        routes: Routes.Creators,
      },
      {
        text: 'Clients',
        icon: <Group />,
        link: '/admin/clients',
        permission: CRUD_ACTION.READ,
        namespace: Namespaces.Clients,
        routes: Routes.Clients,
      },
      {
        text: 'Ambassadors',
        icon: <School />,
        link: '/admin/ambassadors',
        permission: CRUD_ACTION.READ,
        namespace: Namespaces.Ambassadors,
        routes: Routes.Ambassadors,
      },
    ],
  },
  {
    text: 'Admin',
    items: [
      {
        text: 'System Administrators',
        icon: <AdminPanelSettings />,
        link: '/admin/system-administrators',
        permission: CRUD_ACTION.READ,
        namespace: Namespaces.SystemAdministrators,
      },
      {
        text: 'Settings',
        icon: <Settings />,
        link: '/admin/settings',
        permission: CRUD_ACTION.READ,
      },
    ],
  },
];
