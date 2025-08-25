import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import UpsertProjectStepper from '@modules/projects/components/partials/UpsertProjectStepper';

const ProjectsPage: NextPage = () => {
  const { t } = useTranslation(['project', 'common']);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  let projectOwnerId = null;
  if (user?.client) {
    projectOwnerId = user.client.id;
  } else if (user?.ambassador) {
    projectOwnerId = user.ambassador.id;
  }

  return (
    <>
      <PageHeader title={t(`project:${Labels.Projects.CreateNewOne}`)} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t(`project:${Labels.Projects.NewOne}`) },
        ]}
      />
      {loading ? (
        <Skeleton variant="rounded" height={300} />
      ) : (
        <UpsertProjectStepper projectOwnerId={projectOwnerId!} />
      )}
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'topbar',
      'footer',
      'leftbar',
      'project',
      'common',
      'notifications',
    ])),
  },
});

export default withAuth(
  withPermissions(ProjectsPage, {
    requiredPermissions: {
      entity: Namespaces.Projects,
      action: CRUD_ACTION.CREATE,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
