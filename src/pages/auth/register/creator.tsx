import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import CreatorRegisterForm from '@modules/auth/components/pages/CreatorRegisterForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CreatorRegisterPage: NextPage = () => {
  return (
    <>
      <CreatorRegisterForm />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common', 'topbar', 'notifications'])),
    },
  };
};

export default withAuth(CreatorRegisterPage, {
  mode: AUTH_MODE.LOGGED_OUT,
  redirectUrl: Routes.Common.Home,
});
