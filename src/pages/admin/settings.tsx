import { NextPage } from 'next';
import SettingsForm from '@modules/settings/components/SettingsForm';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const AdminSettingsPage: NextPage = () => {
  const { t } = useTranslation(['common']);
  return (
    <>
      <PageHeader title={t('common:admin_settings_title', 'Platform Settings')} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t('common:admin_settings_breadcrumb', 'Settings') },
        ]}
      />
      <SettingsForm />
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
  withPermissions(AdminSettingsPage, {
    requiredPermissions: {
      entity: Namespaces.Users,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
