import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material';

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" gutterBottom>
      {value}
    </Typography>
  </Grid>
);

const CreatorDetailsCard = ({ creator }: { creator: any }) => {
  const user = creator.user || {};
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Creator Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            User Info
          </Typography>
          <Grid container spacing={2} mb={2}>
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Name" value={`${user.firstName} ${user.lastName}`} />
            <InfoItem label="Status" value={user.status} />
            <InfoItem label="User Type" value={user.userType} />
            <InfoItem label="Roles" value={user.rolesNames?.join(', ')} />
            <InfoItem label="Date Registered" value={user.dateRegistered} />
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Creator Info
          </Typography>
          <Grid container spacing={2}>
            <InfoItem label="Verification Status" value={creator.verificationStatus} />
            <InfoItem label="Experience" value={creator.experience} />
            <InfoItem label="Average Rating" value={creator.averageRating} />
            <InfoItem label="Portfolio" value={JSON.stringify(creator.portfolio)} />
            <InfoItem label="Skills" value={JSON.stringify(creator.skills)} />
            <InfoItem label="Languages" value={JSON.stringify(creator.languages)} />
            <InfoItem label="Education" value={JSON.stringify(creator.education)} />
            <InfoItem label="Certifications" value={JSON.stringify(creator.certifications)} />
            <InfoItem label="Achievements" value={JSON.stringify(creator.achievements)} />
            <InfoItem
              label="Professional Background"
              value={JSON.stringify(creator.professionalBackground)}
            />
            <InfoItem label="Media Types" value={JSON.stringify(creator.mediaTypes)} />
            <InfoItem label="Equipment Info" value={JSON.stringify(creator.equipmentInfo)} />
            <InfoItem
              label="Regional Expertise"
              value={JSON.stringify(creator.regionalExpertise)}
            />
            <InfoItem label="Is Journalist" value={String(creator.isJournalist)} />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatorDetailsCard;
