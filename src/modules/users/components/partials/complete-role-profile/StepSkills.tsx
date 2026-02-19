import { Card, CardContent, Stack, Avatar, Typography, Grid, Fade } from '@mui/material';
import { Work } from '@mui/icons-material';
import { RHFTextField, RHFMultiSelect } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';
import { Any } from '@common/defs/types';

interface StepSkillsProps {
  methods: Any;
  t: TFunction;
}

const StepSkills = ({ methods, t }: StepSkillsProps) => {
  const skillOptions = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Video Editing',
    'Photography',
    'Content Writing',
    'Digital Marketing',
    'SEO',
    'Social Media Management',
    'Data Analysis',
    'Project Management',
    'Consulting',
    'Translation',
    'Voice Over',
    'Animation',
    '3D Modeling',
    'Game Development',
    'E-commerce',
    'WordPress',
    'React',
    'Vue.js',
    'Angular',
    'Node.js',
    'Python',
    'Java',
    'PHP',
    'Swift',
    'Kotlin',
    'Flutter',
    'React Native',
    'Adobe Creative Suite',
    'Figma',
    'Sketch',
    'Blender',
    'Unity',
    'Unreal Engine',
  ];

  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Work />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('creator:skills_and_expertise')}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('creator:skills_description')}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RHFMultiSelect
                name="skills"
                label={t('creator:skills')}
                placeholder={t('creator:select_skills')}
                helperText={t('creator:skills_help')}
                options={skillOptions.map((skill) => ({ value: skill, label: skill }))}
                chip
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepSkills;
