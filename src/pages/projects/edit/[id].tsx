import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useProjects from '@modules/projects/hooks/useProjects';
import { Project } from '@modules/projects/defs/types';
import UpsertProjectStepper from '@modules/projects/components/partials/UpsertProjectStepper';

const ProjectsPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readOne } = useProjects({ autoRefetchAfterMutation: false });
  const [loaded, setLoaded] = useState(false);
  const [project, setProject] = useState<null | Project>(null);
  const id: Id = Number(router.query.id);
  const { t } = useTranslation(['project', 'common']);

  useEffect(() => {
    if (loaded) {
      stop();
    } else {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (id) {
      const { data } = await readOne(id);
      if (data) {
        if (data.item) {
          setProject(data.item);
        }
      }
      setLoaded(true);
    }
  };

  return (
    <>
      <PageHeader title={t(`project:${Labels.Projects.EditOne}`)} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: project ? project.title : t(`project:${Labels.Projects.EditOne}`) },
        ]}
      />

      {project && <UpsertProjectStepper projectId={id} projectOwnerId={project.clientId!} />}
    </>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
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
      action: CRUD_ACTION.UPDATE,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
