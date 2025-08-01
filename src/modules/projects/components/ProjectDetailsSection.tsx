import { Box, Typography, Avatar, Paper } from '@mui/material';
import { Project } from '../defs/types';
import ProjectCard from './partials/ProjectCard';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface Props {
  project: Project;
  isProjectOwner?: boolean;
}

const ProjectDetailsSection = ({ project, isProjectOwner }: Props) => {
  const owner = project.client?.user;

  console.log(isProjectOwner);
  return (
    <Box>
      <ProjectCard project={project} hideAction={!isProjectOwner} />
      {owner && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mt: 3,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'linear-gradient(90deg, #f8fafc 70%, #e3f2fd 100%)',
            boxShadow: '0 2px 8px rgba(80,120,200,0.06)',
          }}
        >
          <UserAvatar user={owner as User} size="medium" />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {owner.firstName} {owner.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Project Owner
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ProjectDetailsSection;
