import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';

interface CompleteProfileFormData {
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  preferredLanguage: string;
  timezone: string;
  profilePicture: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings: {
    profileVisibility: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
  };
  socialMediaLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year: string;
  }>;
  professionalBackground: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  achievements: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  preferences: {
    theme: string;
    language: string;
    timezone: string;
  };
}

export const useCompleteProfile = () => {
  const { t } = useTranslation(['common', 'user', 'auth']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const ProfileSchema = Yup.object().shape({
    phoneNumber: Yup.string().nullable(),
    address: Yup.string().nullable(),
    city: Yup.string().nullable(),
    state: Yup.string().nullable(),
    country: Yup.string().nullable(),
    postalCode: Yup.string().nullable(),
    bio: Yup.string().nullable().max(1000, t('common:bio_too_long')),
    dateOfBirth: Yup.date().nullable(),
    gender: Yup.string().nullable().oneOf(['MALE', 'FEMALE', 'OTHER']),
    preferredLanguage: Yup.string().nullable(),
    timezone: Yup.string().nullable(),
    profilePicture: Yup.string().nullable(),
    notificationPreferences: Yup.object().shape({
      email: Yup.boolean(),
      sms: Yup.boolean(),
      push: Yup.boolean(),
    }),
    privacySettings: Yup.object().shape({
      profileVisibility: Yup.string().oneOf(['PUBLIC', 'PRIVATE', 'FRIENDS']),
      showEmail: Yup.boolean(),
      showPhone: Yup.boolean(),
      showAddress: Yup.boolean(),
    }),
    socialMediaLinks: Yup.object().shape({
      facebook: Yup.string().nullable(),
      twitter: Yup.string().nullable(),
      linkedin: Yup.string().nullable(),
      instagram: Yup.string().nullable(),
    }),
    education: Yup.array().of(
      Yup.object().shape({
        degree: Yup.string().nullable(),
        field: Yup.string().nullable(),
        institution: Yup.string().nullable(),
        year: Yup.string().nullable(),
      })
    ),
    professionalBackground: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().nullable(),
        company: Yup.string().nullable(),
        duration: Yup.string().nullable(),
        description: Yup.string().nullable(),
      })
    ),
    achievements: Yup.array().of(Yup.string().nullable()),
    emergencyContact: Yup.object().shape({
      name: Yup.string().nullable(),
      relationship: Yup.string().nullable(),
      phone: Yup.string().nullable(),
      email: Yup.string().nullable(),
    }),
    preferences: Yup.object().shape({
      theme: Yup.string().nullable(),
      language: Yup.string().nullable(),
      timezone: Yup.string().nullable(),
    }),
  });

  const methods = useForm<CompleteProfileFormData>({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      phoneNumber: user?.phone_number || '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      bio: '',
      dateOfBirth: '',
      gender: '',
      preferredLanguage: user?.preferred_language || '',
      timezone: user?.timezone || '',
      profilePicture: '',
      notificationPreferences: {
        email: true,
        sms: false,
        push: true,
      },
      privacySettings: {
        profileVisibility: 'PUBLIC',
        showEmail: false,
        showPhone: false,
        showAddress: false,
      },
      socialMediaLinks: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
      },
      education: [],
      professionalBackground: [],
      achievements: [],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: '',
      },
      preferences: {
        theme: 'light',
        language: user?.preferred_language || 'en',
        timezone: user?.timezone || '',
      },
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      if (user.status === 'ACTIVE' && user.profile) {
        router.push(Routes.Users.Me);
        return;
      }

      setIsLoading(false);
    }
  }, [user, router]);

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone_number: data.phoneNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postalCode,
          bio: data.bio,
          date_of_birth: data.dateOfBirth || null,
          gender: data.gender || null,
          preferred_language: data.preferredLanguage,
          timezone: data.timezone,
          profile_picture: data.profilePicture,
          notification_preferences: data.notificationPreferences,
          privacy_settings: data.privacySettings,
          social_media_links: data.socialMediaLinks,
          education: data.education.filter(
            (edu) => edu.degree || edu.field || edu.institution || edu.year
          ),
          professional_background: data.professionalBackground.filter(
            (job) => job.title || job.company || job.duration || job.description
          ),
          achievements: data.achievements.filter((achievement) => achievement.trim() !== ''),
          emergency_contact: data.emergencyContact,
          preferences: data.preferences,
        }),
      });

      const result = await response.json();

      if (result.success) {
        enqueueSnackbar(t('user:profile_completed_successfully'), { variant: 'success' });
        router.push(Routes.Users.Me);
      } else {
        enqueueSnackbar(result.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    }
  };

  const handleSkip = () => {
    router.push(Routes.Users.Me);
  };

  return {
    methods,
    isLoading,
    isSubmitting,
    onSubmit: handleSubmit(onSubmit),
    handleSkip,
  };
};
