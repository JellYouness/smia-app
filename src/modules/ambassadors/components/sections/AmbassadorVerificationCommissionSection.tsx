import React from 'react';
import SectionCard from '@modules/users/components/SectionCard';
import InfoItem from '@modules/users/components/InfoItem';
import { Description, AttachMoney } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Stack, Typography } from '@mui/material';
import { Ambassador } from '../../defs/types';

interface AmbassadorVerificationCommissionSectionProps {
  ambassador: Ambassador;
  t: TFunction;
  readOnly?: boolean;
  onEdit?: () => void;
}

const AmbassadorVerificationCommissionSection = ({
  ambassador,
  t,
  readOnly,
  onEdit,
}: AmbassadorVerificationCommissionSectionProps) => (
  <SectionCard
    title={t('user:verification_commission') || 'Verification & Commission'}
    readOnly={readOnly}
    onEdit={onEdit}
  >
    <Stack direction="row" spacing={2}>
      <Description />
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {t('user:verification_documents') || 'Verification Documents'}:
      </Typography>
    </Stack>
    {ambassador.verificationDocuments?.length > 0 ? (
      <Stack spacing={0.5} sx={{ ml: 4, my: 1 }}>
        {ambassador.verificationDocuments.map((doc: string, idx: number) => (
          <Typography
            key={idx}
            variant="body2"
            color="primary.main"
            sx={{ mb: 1 }}
            component="a"
            href={doc}
            target="_blank"
            rel="noopener noreferrer"
          >
            - {doc}
          </Typography>
        ))}
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {t('user:no_verification_documents') || 'No verification documents provided.'}
      </Typography>
    )}
    <InfoItem
      label={t('user:commission_rate') || 'Commission Rate'}
      value={ambassador.commissionRate}
      icon={<AttachMoney />}
    />
  </SectionCard>
);

export default AmbassadorVerificationCommissionSection;
