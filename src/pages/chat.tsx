import React, { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';
import { ChatWindow } from '@modules/chat/components/ChatWindow';
import { ChatProvider } from '@modules/chat/contexts/ChatContext';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';

const ChatPage: NextPage = () => {
  const { t } = useTranslation(['common', 'chat']);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();

  return (
    <ChatProvider>
      <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h4">{t('chat:title')}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <ChatWindow
            selectedConversationId={selectedConversationId}
            onConversationSelect={setSelectedConversationId}
          />
        </Box>
      </Box>
    </ChatProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', [
      'topbar',
      'footer',
      'leftbar',
      'common',
      'chat',
    ])),
  },
});

export default withAuth(ChatPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
