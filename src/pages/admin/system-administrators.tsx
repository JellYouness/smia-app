import { NextPage } from 'next';
import SystemAdministratorsTable from '@modules/system-administrators/components/SystemAdministratorsTable';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';

const AdminSystemAdministratorsPage: NextPage = () => {
  const { t } = useTranslation(['user', 'common']);
  return (
    <>
      <PageHeader
        title={t('user:admin_system_administrators_title', 'Manage System Administrators')}
      />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t('user:admin_system_administrators_breadcrumb', 'System Administrators') },
        ]}
      />
      <SystemAdministratorsTable />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'topbar',
      'footer',
      'leftbar',
      'user',
      'common',
      'notifications',
    ])),
  },
});

export default withAuth(
  withPermissions(AdminSystemAdministratorsPage, {
    requiredPermissions: {
      entity: 'system_administrators',
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
