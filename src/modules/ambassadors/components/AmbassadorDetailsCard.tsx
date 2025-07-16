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

const AmbassadorDetailsCard = ({ ambassador }: { ambassador: any }) => {
  const user = ambassador.user || {};
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Ambassador Details
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
            Ambassador Info
          </Typography>
          <Grid container spacing={2}>
            <InfoItem label="Team Name" value={ambassador.teamName} />
            <InfoItem label="Team Members" value={JSON.stringify(ambassador.teamMembers)} />
            <InfoItem label="Specializations" value={JSON.stringify(ambassador.specializations)} />
            <InfoItem
              label="Regional Expertise"
              value={JSON.stringify(ambassador.regionalExpertise)}
            />
            <InfoItem
              label="Service Offerings"
              value={JSON.stringify(ambassador.serviceOfferings)}
            />
            <InfoItem label="Client Count" value={ambassador.clientCount} />
            <InfoItem label="Project Capacity" value={ambassador.projectCapacity} />
            <InfoItem label="Application Status" value={ambassador.applicationStatus} />
            <InfoItem label="Application Date" value={ambassador.applicationDate} />
            <InfoItem
              label="Verification Documents"
              value={JSON.stringify(ambassador.verificationDocuments)}
            />
            <InfoItem label="Commission Rate" value={ambassador.commissionRate} />
            <InfoItem label="Team Description" value={ambassador.teamDescription} />
            <InfoItem label="Featured Work" value={JSON.stringify(ambassador.featuredWork)} />
            <InfoItem label="Years in Business" value={ambassador.yearsInBusiness} />
            <InfoItem
              label="Business Address"
              value={`${ambassador.businessStreet}, ${ambassador.businessCity}, ${ambassador.businessState}, ${ambassador.businessPostalCode}, ${ambassador.businessCountry}`}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AmbassadorDetailsCard;
