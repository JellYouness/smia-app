import { NextPage } from 'next';
import ClientsTable from '@modules/clients/components/ClientsTable';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';

const AdminClientsPage: NextPage = () => {
  const { t } = useTranslation(['user', 'common']);
  return (
    <>
      <PageHeader title={t('user:admin_clients_title', 'Manage Clients')} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t('user:admin_clients_breadcrumb', 'Clients') },
        ]}
      />
      <ClientsTable />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
  },
});

export default withAuth(
  withPermissions(AdminClientsPage, {
    requiredPermissions: {
      entity: Namespaces.Clients,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
