import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import ClientRegisterForm from '@modules/auth/components/pages/ClientRegisterForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ClientRegisterPage: NextPage = () => {
  return (
    <>
      <ClientRegisterForm />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common', 'topbar'])),
    },
  };
};

export default withAuth(ClientRegisterPage, {
  mode: AUTH_MODE.LOGGED_OUT,
  redirectUrl: Routes.Common.Home,
});
