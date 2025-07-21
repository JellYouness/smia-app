import { Box, Stack } from '@mui/material';
import { ProjectCreator } from '../defs/types';
import CreatorPermissionItem from './CreatorPermissionItem';

interface Props {
  projectId: number;
  creators: ProjectCreator[];
}

const CreatorsPermissionsList = ({ projectId, creators }: Props) => {
  if (!creators.length) {
    return (
      <Box color="text.secondary" p={2}>
        No team members yet.
      </Box>
    );
  }
  return (
    <Stack spacing={1.5}>
      {creators.map((pc) => (
        <CreatorPermissionItem key={pc.id} projectId={projectId} projectCreator={pc} />
      ))}
    </Stack>
  );
};

export default CreatorsPermissionsList;
