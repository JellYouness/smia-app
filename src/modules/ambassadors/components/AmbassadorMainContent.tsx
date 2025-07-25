import React from 'react';
import { Stack, Typography, Chip, Grid } from '@mui/material';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import {
  AttachMoney,
  Build,
  Business,
  CalendarMonth,
  CheckCircle,
  Description,
  LocationOn,
  People,
} from '@mui/icons-material';
import { TFunction } from 'i18next';
import { User } from '@modules/users/defs/types';

interface AmbassadorMainContentProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
}

const AmbassadorMainContent = ({ user, t, readOnly }: AmbassadorMainContentProps) => {
  const ambassador = user.ambassador || user; // support both user.ambassador and direct ambassador
  return (
    <Stack spacing={0}>
      {/* About Section */}
      <SectionCard title={user?.profile?.title || t('user:about')} readOnly={readOnly}>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || 'No bio provided.'}
        </Typography>
      </SectionCard>

      {/* Team Section */}
      <SectionCard title={t('user:team') || 'Team'} readOnly={readOnly}>
        <InfoItem
          label={t('user:team_name') || 'Team Name'}
          value={ambassador.teamName}
          icon={<Business />}
        />
        <InfoItem
          label={t('user:team_members') || 'Team Members'}
          value={JSON.stringify(ambassador.teamMembers)}
          icon={<People />}
        />
      </SectionCard>

      {/* Specializations */}
      <SectionCard title={t('user:specializations') || 'Specializations'} readOnly={readOnly}>
        <Grid container spacing={1}>
          {(ambassador.specializations || []).map((spec: string, idx: number) => (
            <Grid item key={idx}>
              <Chip label={spec} color="primary" />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      {/* Regional Expertise */}
      <SectionCard title={t('user:regional_expertise') || 'Regional Expertise'} readOnly={readOnly}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(ambassador.regionalExpertise, null, 2)}
        </pre>
      </SectionCard>

      {/* Service Offerings */}
      <SectionCard title={t('user:service_offerings') || 'Service Offerings'} readOnly={readOnly}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(ambassador.serviceOfferings, null, 2)}
        </pre>
      </SectionCard>

      {/* Application Status */}
      <SectionCard title={t('user:application_status') || 'Application Status'} readOnly={readOnly}>
        <InfoItem
          label={t('user:application_status') || 'Application Status'}
          value={ambassador.applicationStatus}
          icon={<CheckCircle />}
        />
        <InfoItem
          label={t('user:application_date') || 'Application Date'}
          value={ambassador.applicationDate}
          icon={<CalendarMonth />}
        />
      </SectionCard>

      {/* Client & Project Info */}
      <SectionCard title={t('user:clients_projects') || 'Clients & Projects'} readOnly={readOnly}>
        <InfoItem
          label={t('user:client_count') || 'Client Count'}
          value={ambassador.clientCount}
          icon={<People />}
        />
        <InfoItem
          label={t('user:project_capacity') || 'Project Capacity'}
          value={ambassador.projectCapacity}
          icon={<Build />}
        />
      </SectionCard>

      {/* Verification & Commission */}
      <SectionCard
        title={t('user:verification_commission') || 'Verification & Commission'}
        readOnly={readOnly}
      >
        <InfoItem
          label={t('user:verification_documents') || 'Verification Documents'}
          value={JSON.stringify(ambassador.verificationDocuments)}
          icon={<Description />}
        />
        <InfoItem
          label={t('user:commission_rate') || 'Commission Rate'}
          value={ambassador.commissionRate}
          icon={<AttachMoney />}
        />
      </SectionCard>

      {/* Team Description & Featured Work */}
      <SectionCard title={t('user:team_description') || 'Team Description'} readOnly={readOnly}>
        <Typography variant="body1">{ambassador.teamDescription}</Typography>
        <InfoItem
          label={t('user:featured_work') || 'Featured Work'}
          value={JSON.stringify(ambassador.featuredWork)}
          icon={<Description />}
        />
      </SectionCard>

      {/* Business Info */}
      <SectionCard title={t('user:business_info') || 'Business Info'} readOnly={readOnly}>
        <InfoItem
          label={t('user:years_in_business') || 'Years in Business'}
          value={ambassador.yearsInBusiness}
          icon={<Business />}
        />
        <InfoItem
          label={t('user:business_address') || 'Business Address'}
          value={`${ambassador.businessStreet}, ${ambassador.businessCity}, ${ambassador.businessState}, ${ambassador.businessPostalCode}, ${ambassador.businessCountry}`}
          icon={<LocationOn />}
        />
      </SectionCard>
    </Stack>
  );
};

export default AmbassadorMainContent;
