import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Box } from '@mui/material';

const RegisterPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the proper registration selection page
    router.replace('/auth/register/');
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default RegisterPage;
