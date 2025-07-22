import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography, Button, Paper } from '@mui/material';
import { ChatWindow } from '@modules/chat/components/ChatWindow';
import { useGetOrCreateProjectConversation } from '@modules/chat/hooks/useChat';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useTranslation } from 'react-i18next';
import { Any } from '@common/defs/types';

const ProjectChatPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(['project', 'chat', 'common']);
  const { user } = useAuth();
  const getOrCreateProjectConversation = useGetOrCreateProjectConversation();
  const [projectConversationId, setProjectConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      getOrCreateProjectConversation.mutate(
        { projectId: Number(id) },
        {
          onSuccess: (data: Any) => {
            setProjectConversationId(data?.data?.id || data?.id || null);
          },
        }
      );
    }
  }, [id, user?.id]);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button variant="outlined" onClick={() => router.push(`/projects/${id}`)} sx={{ mr: 2 }}>
          {t('common:back', 'Back to Project')}
        </Button>
        {/* <Typography variant="h5" fontWeight={700}>
          {t('project:project_chat', 'Project Chat')}
        </Typography> */}
      </Box>
      {getOrCreateProjectConversation.isPending && (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
          <CircularProgress size={32} thickness={4} sx={{ mr: 2 }} />
          <Typography variant="body1">{t('chat:loading', 'Loading chat...')}</Typography>
        </Box>
      )}
      {getOrCreateProjectConversation.isError && (
        <Typography color="error" variant="body2">
          {t('chat:error_loading_conversation', 'Error loading project chat.')}
        </Typography>
      )}
      {projectConversationId && !getOrCreateProjectConversation.isPending && (
        <Paper elevation={1} sx={{ p: 0, mt: 2 }}>
          <ChatWindow
            selectedConversationId={projectConversationId}
            onConversationSelect={() => {}}
            onProjectPage
          />
        </Paper>
      )}
    </Container>
  );
};

export default ProjectChatPage;
