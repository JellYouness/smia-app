import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { TFunction } from 'i18next';
import { User } from '@modules/users/defs/types';
import AmbassadorTeamSection from './sections/AmbassadorTeamSection';
import AmbassadorSpecializationsSection from './sections/AmbassadorSpecializationsSection';
import AmbassadorRegionalExpertiseSection from './sections/AmbassadorRegionalExpertiseSection';
import AmbassadorServiceOfferingsSection from './sections/AmbassadorServiceOfferingsSection';
import AmbassadorApplicationStatusSection from './sections/AmbassadorApplicationStatusSection';
import AmbassadorClientsProjectsSection from './sections/AmbassadorClientsProjectsSection';
import AmbassadorVerificationCommissionSection from './sections/AmbassadorVerificationCommissionSection';
import AmbassadorTeamDescriptionSection from './sections/AmbassadorTeamDescriptionSection';
import AmbassadorBusinessInfoSection from './sections/AmbassadorBusinessInfoSection';
import { Ambassador } from '../defs/types';
import {
  EditRegionalExpertiseDialog,
  EditServiceOfferingsDialog,
  EditTeamDescriptionDialog,
  EditTeamDialog,
  EditVerificationCommissionDialog,
  EditBusinessInfoDialog,
  EditSpecializationsDialog,
} from './dialogs';
import useAmbassador from '../hooks/useAmbassador';
import useAuth from '@modules/auth/hooks/api/useAuth';

interface AmbassadorMainContentProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
}

const AmbassadorMainContent = ({ user, t, readOnly }: AmbassadorMainContentProps) => {
  const ambassador = user.ambassador as Ambassador;
  const [openRegionalExpertiseDialog, setOpenRegionalExpertiseDialog] = useState(false);
  const [openServiceOfferingsDialog, setOpenServiceOfferingsDialog] = useState(false);
  const [openVerificationCommissionDialog, setOpenVerificationCommissionDialog] = useState(false);
  const [openTeamDescriptionDialog, setOpenTeamDescriptionDialog] = useState(false);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openBusinessInfoDialog, setOpenBusinessInfoDialog] = useState(false);
  const [openSpecializationsDialog, setOpenSpecializationsDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate } = useAuth();

  const { patchAmbassador } = useAmbassador();
  const handleRegionalExpertiseDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        regionalExpertise: data.regionalExpertise,
      });

      if (response.success) {
        setOpenRegionalExpertiseDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving regional expertise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceOfferingsDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        serviceOfferings: data.serviceOfferings,
      });

      if (response.success) {
        setOpenServiceOfferingsDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving service offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCommissionDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        verificationDocuments: data.verificationDocuments,
        commissionRate: data.commissionRate,
      });

      if (response.success) {
        setOpenVerificationCommissionDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving verification commission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamDescriptionDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        teamDescription: data.teamDescription,
      });

      if (response.success) {
        setOpenTeamDescriptionDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving team description:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        teamMembers: data.teamMembers,
        teamName: data.teamName,
      });

      if (response.success) {
        setOpenTeamDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessInfoDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        yearsInBusiness: data.yearsInBusiness,
        businessStreet: data.businessStreet,
        businessCity: data.businessCity,
        businessState: data.businessState,
        businessPostalCode: data.businessPostalCode,
        businessCountry: data.businessCountry,
      });

      if (response.success) {
        setOpenBusinessInfoDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving business info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationsDialogSave = async (data: Partial<Ambassador>) => {
    setLoading(true);
    try {
      const response = await patchAmbassador(ambassador.id, {
        specializations: data.specializations,
      });

      if (response.success) {
        setOpenSpecializationsDialog(false);
        mutate();
      }
    } catch (error) {
      console.error('Error saving specializations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={0}>
      <AmbassadorTeamSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenTeamDialog(true)}
      />
      <AmbassadorSpecializationsSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenSpecializationsDialog(true)}
      />
      <AmbassadorRegionalExpertiseSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenRegionalExpertiseDialog(true)}
      />
      <AmbassadorServiceOfferingsSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenServiceOfferingsDialog(true)}
      />
      <AmbassadorApplicationStatusSection ambassador={ambassador} t={t} />
      <AmbassadorClientsProjectsSection ambassador={ambassador} t={t} />
      <AmbassadorVerificationCommissionSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenVerificationCommissionDialog(true)}
      />
      <AmbassadorTeamDescriptionSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenTeamDescriptionDialog(true)}
      />
      <AmbassadorBusinessInfoSection
        ambassador={ambassador}
        t={t}
        readOnly={readOnly}
        onEdit={() => setOpenBusinessInfoDialog(true)}
      />

      {/* dialogs */}
      <EditRegionalExpertiseDialog
        ambassador={ambassador}
        onSave={handleRegionalExpertiseDialogSave}
        loading={loading}
        open={openRegionalExpertiseDialog}
        onClose={() => setOpenRegionalExpertiseDialog(false)}
        t={t}
      />
      <EditServiceOfferingsDialog
        ambassador={ambassador}
        onSave={handleServiceOfferingsDialogSave}
        loading={loading}
        open={openServiceOfferingsDialog}
        onClose={() => setOpenServiceOfferingsDialog(false)}
        t={t}
      />
      <EditVerificationCommissionDialog
        ambassador={ambassador}
        onSave={handleVerificationCommissionDialogSave}
        loading={loading}
        open={openVerificationCommissionDialog}
        onClose={() => setOpenVerificationCommissionDialog(false)}
        t={t}
      />
      <EditTeamDescriptionDialog
        ambassador={ambassador}
        onSave={handleTeamDescriptionDialogSave}
        loading={loading}
        open={openTeamDescriptionDialog}
        onClose={() => setOpenTeamDescriptionDialog(false)}
        t={t}
      />
      <EditTeamDialog
        ambassador={ambassador}
        onSave={handleTeamDialogSave}
        loading={loading}
        open={openTeamDialog}
        onClose={() => setOpenTeamDialog(false)}
        t={t}
      />
      <EditBusinessInfoDialog
        ambassador={ambassador}
        onSave={handleBusinessInfoDialogSave}
        loading={loading}
        open={openBusinessInfoDialog}
        onClose={() => setOpenBusinessInfoDialog(false)}
        t={t}
      />
      <EditSpecializationsDialog
        ambassador={ambassador}
        onSave={handleSpecializationsDialogSave}
        loading={loading}
        open={openSpecializationsDialog}
        onClose={() => setOpenSpecializationsDialog(false)}
        t={t}
      />
    </Stack>
  );
};

export default AmbassadorMainContent;
