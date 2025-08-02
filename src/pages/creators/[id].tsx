import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import CreatorsApiRoutes from '@modules/creators/defs/api-routes';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Typography, Grid, Skeleton } from '@mui/material';
import { TFunction } from 'next-i18next';
import { User } from '@modules/users/defs/types';
import { Creator } from '@modules/creators/defs/types';
import SendMessageModal from '@modules/creators/components/SendMessageModal';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useCreateDirectConversation, useSendMessage } from '@modules/chat/hooks/useChat';
import { useSnackbar } from 'notistack';
import ProfileHeader from '@modules/creators/components/creator-profle/partials/ProfileHeader';
import CreatorSidebar from '@modules/creators/components/creator-profle/CreatorSidebar';
import CreatorMainContent from '@modules/creators/components/creator-profle/CreatorMainContent';

const CreatorProfilePage = ({ item, t }: { item: User; t: TFunction }) => {
  const creator = item.creator as Creator;
  const user = item;

  // Send Message Modal state
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { user: currentUser } = useAuth();
  const createDirectConversation = useCreateDirectConversation();
  const sendMessageMutation = useSendMessage();
  const { enqueueSnackbar } = useSnackbar();

  const handleSendMessage = async (message: string) => {
    if (!creator.userId || !currentUser) {
      return;
    }
    setSending(true);
    try {
      // Create or get direct conversation
      const conversation = await createDirectConversation.mutateAsync({ userId: creator.userId });
      if (conversation && conversation.id) {
        await sendMessageMutation.mutateAsync({
          conversationId: String(conversation.id),
          data: { content: message },
        });
      }
      enqueueSnackbar(t('user:message_sent', 'Message sent'), {
        variant: 'success',
      });
    } catch (e) {
      enqueueSnackbar(t('user:message_failed', 'Message failed'), {
        variant: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxWidth: { xs: '100%', sm: '90%', lg: '80%' },
        mx: 'auto',
        p: { xs: 2, md: 4 },
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProfileHeader
            user={user}
            creator={creator}
            setSendMessageOpen={setSendMessageOpen}
            t={t}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CreatorSidebar user={user} readOnly />
        </Grid>
        <Grid item xs={12} md={8}>
          <CreatorMainContent user={user} t={t} readOnly />
        </Grid>
      </Grid>
      {/* Send Message Modal */}
      <SendMessageModal
        open={sendMessageOpen}
        creator={creator}
        onClose={() => setSendMessageOpen(false)}
        onSubmit={handleSendMessage}
        loading={sending}
      />
    </Box>
  );
};

const CreatorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(CreatorsApiRoutes);
  const [item, setItem] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user', 'common']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            const item = data.item as User;
            setItem({ ...item.user, creator: { ...item } });
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={200} />
          </Grid>
        </Grid>
      </Box>
    );
  }
  if (!item) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6">{t('user:not_found', 'Creator not found')}</Typography>
      </Box>
    );
  }

  return <CreatorProfilePage item={item} t={t} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || 'en';
  return {
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
  };
};

export default withAuth(
  withPermissions(CreatorDetailsPage, {
    requiredPermissions: {
      entity: Namespaces.Creators,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
