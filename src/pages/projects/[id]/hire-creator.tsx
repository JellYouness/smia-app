import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { GetStaticPaths, NextPage } from 'next';
import Routes from '@common/defs/routes';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import HireCreatorStepper from '@modules/projects/components/partials/HireCreatorStepper';
import { StepKey } from '@modules/projects/components/partials/HireStepperBar';

const HireCreatorPage: NextPage = () => {
  const { t } = useTranslation(['project', 'common']);
  const { user } = useAuth();
  const router = useRouter();
  const { step } = router.query;

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<StepKey>('invite');

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (step === 'review' || step === 'hire') {
      setCurrentStep(step as StepKey);
    } else {
      setCurrentStep('invite');
    }
  }, [step]);

  const handleStepChange = (newStep: StepKey) => {
    setCurrentStep(newStep);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, step: newStep },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {loading ? (
        <Skeleton variant="rounded" height={600} />
      ) : (
        <HireCreatorStepper active={currentStep} onStepChange={handleStepChange} />
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'project', 'common'])),
  },
});

export default withAuth(
  withPermissions(HireCreatorPage, {
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
