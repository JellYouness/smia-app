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

const ClientDetailsCard = ({ client }: { client: any }) => {
  const user = client.user || {};
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Client Details
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
            Client Info
          </Typography>
          <Grid container spacing={2}>
            <InfoItem label="Company Name" value={client.companyName} />
            <InfoItem label="Company Size" value={client.companySize} />
            <InfoItem label="Industry" value={client.industry} />
            <InfoItem label="Website URL" value={client.websiteUrl} />
            <InfoItem
              label="Billing Address"
              value={`${client.billingStreet}, ${client.billingCity}, ${client.billingState}, ${client.billingPostalCode}, ${client.billingCountry}`}
            />
            <InfoItem label="Tax Identifier" value={client.taxIdentifier} />
            <InfoItem label="Budget" value={client.budget} />
            <InfoItem label="Preferred Creators" value={JSON.stringify(client.preferredCreators)} />
            <InfoItem label="Project Count" value={client.projectCount} />
            <InfoItem
              label="Default Project Settings"
              value={JSON.stringify(client.defaultProjectSettings)}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientDetailsCard;
