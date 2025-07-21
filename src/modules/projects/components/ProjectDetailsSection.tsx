import { Box, Typography, Avatar, Paper } from '@mui/material';
import { Project } from '../defs/types';
import ProjectCard from './partials/ProjectCard';

interface Props {
  project: Project;
}

const ProjectDetailsSection = ({ project }: Props) => {
  const owner = project.client?.user;
  return (
    <Box>
      <ProjectCard project={project} hideAction />
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
          <Avatar src={owner.profileImage} sx={{ width: 40, height: 40, mr: 2 }} />
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
