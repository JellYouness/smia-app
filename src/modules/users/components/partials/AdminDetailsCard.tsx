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

const AdminDetailsCard = ({ admin }: { admin: any }) => {
  const user = admin.user || {};
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Admin Details
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
            Admin Info
          </Typography>
          <Grid container spacing={2}>
            <InfoItem label="Access Level" value={admin.accessLevel || admin.access_level} />
            <InfoItem
              label="Departments"
              value={Array.isArray(admin.departments) ? admin.departments.join(', ') : ''}
            />
            <InfoItem label="Audit Log" value={String(admin.auditLog || admin.audit_log)} />
            <InfoItem
              label="Last Permission Update"
              value={admin.lastPermissionUpdate || admin.last_permission_update}
            />
            <InfoItem
              label="Restricted IP Access"
              value={String(admin.restrictedIpAccess || admin.restricted_ip_access)}
            />
            <InfoItem
              label="Allowed IP Addresses"
              value={JSON.stringify(admin.allowedIpAddresses || admin.allowed_ip_addresses)}
            />
            <InfoItem
              label="Emergency Contact"
              value={admin.emergencyContact || admin.emergency_contact}
            />
            <InfoItem
              label="Security Clearance"
              value={admin.securityClearance || admin.security_clearance}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDetailsCard;
