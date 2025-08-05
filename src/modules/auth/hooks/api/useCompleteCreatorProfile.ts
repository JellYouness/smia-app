import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';

interface CreatorProfileData {
  title: string;
  bio: string;
  shortBio: string;
  hourlyRate: number | null;
  skills: string[];
  portfolio: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    url: string;
  }>;
  achievements: string[];
  equipment: Array<{
    name: string;
    description: string;
  }>;
  regionalExpertise: string[];
  mediaTypes: string[];
  availability: string;
  preferredProjectTypes: string[];
  preferredTimeline: string;
}

export const useCompleteCreatorProfile = () => {
  const { t } = useTranslation(['common', 'creator']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeCreatorProfile = async (data: CreatorProfileData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/auth/complete-creator-profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: data.title,
            bio: data.bio,
            short_bio: data.shortBio,
            hourly_rate: data.hourlyRate,
            skills: data.skills,
            portfolio: data.portfolio,
            professional_background: data.experience,
            certifications: data.certifications,
            achievements: data.achievements,
            equipment_info: {
              cameras:
                data.equipment.find((eq) => eq.name === 'Cameras')?.description?.split(', ') || [],
              lenses:
                data.equipment.find((eq) => eq.name === 'Lenses')?.description?.split(', ') || [],
              audio:
                data.equipment.find((eq) => eq.name === 'Audio')?.description?.split(', ') || [],
              lighting:
                data.equipment.find((eq) => eq.name === 'Lighting')?.description?.split(', ') || [],
            },
            regional_expertise: data.regionalExpertise?.map((region) => ({ region })) || [],
            media_types: data.mediaTypes?.map((type) => type.toUpperCase()) || [],
            availability: data.availability,
            preferred_project_types: data.preferredProjectTypes || [],
            preferred_timeline: data.preferredTimeline || '',
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        enqueueSnackbar(t('creator:creator_profile_completed_successfully'), {
          variant: 'success',
        });
        router.push(Routes.Users.Me);
      } else {
        enqueueSnackbar(result.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error completing creator profile:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    completeCreatorProfile,
    isSubmitting,
  };
};
