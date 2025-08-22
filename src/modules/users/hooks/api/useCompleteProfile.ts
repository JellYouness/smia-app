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
  profilePicture: File | null;
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

  // Step-specific validation schemas
  const getStepValidationSchema = (step: number) => {
    switch (step) {
      case 0: // Personal Information
        return Yup.object().shape({
          phoneNumber: Yup.string()
            .nullable()
            .test('phone-format', t('user:invalid_phone_format'), (value) => {
              if (!value) {
                return true; // Optional field
              }
              // Handle international phone format from mui-tel-input
              // Remove any non-digit characters except + at the beginning
              const cleanValue = value.replace(/[^\d+]/g, '');
              // Must start with + and have at least 7 digits (country code + number)
              const phoneRegex = /^\+[1-9]\d{6,14}$/;
              return phoneRegex.test(cleanValue);
            }),
          gender: Yup.string().nullable().oneOf(['MALE', 'FEMALE', 'OTHER']),
          dateOfBirth: Yup.date()
            .nullable()
            .max(new Date(), t('user:date_of_birth_cannot_be_future')),
          preferredLanguage: Yup.string().nullable(),
          timezone: Yup.string().nullable(),
          profilePicture: Yup.mixed()
            .nullable()
            .test('file-size', t('common:file_size_error', { maxSize: 5 }), (value) => {
              if (!value) {
                return true; // Optional field
              }
              if (value instanceof File) {
                return value.size <= 5 * 1024 * 1024; // 5MB
              }
              return true;
            })
            .test('file-type', t('user:invalid_image_format'), (value) => {
              if (!value) {
                return true; // Optional field
              }
              if (value instanceof File) {
                return value.type.startsWith('image/');
              }
              return true;
            }),
          bio: Yup.string().nullable().max(1000, t('common:bio_too_long')),
        });

      case 1: // Address
        return Yup.object().shape({
          address: Yup.string().nullable(),
          city: Yup.string().nullable(),
          state: Yup.string().nullable(),
          country: Yup.string().nullable(),
          postalCode: Yup.string().nullable(),
        });

      case 2: // Notifications
        return Yup.object().shape({
          notificationPreferences: Yup.object().shape({
            email: Yup.boolean().required(),
            sms: Yup.boolean().required(),
            push: Yup.boolean().required(),
          }),
        });

      case 3: // Privacy
        return Yup.object().shape({
          privacySettings: Yup.object().shape({
            profileVisibility: Yup.string()
              .required(t('user:profile_visibility_required'))
              .oneOf(['PUBLIC', 'PRIVATE', 'FRIENDS']),
            showEmail: Yup.boolean().required(),
            showPhone: Yup.boolean().required(),
            showAddress: Yup.boolean().required(),
          }),
        });

      case 4: // Social Media
        return Yup.object().shape({
          socialMediaLinks: Yup.object().shape({
            facebook: Yup.string().nullable(),
            twitter: Yup.string().nullable(),
            linkedin: Yup.string().nullable(),
            instagram: Yup.string().nullable(),
          }),
        });

      case 5: // Emergency Contact
        return Yup.object().shape({
          emergencyContact: Yup.object().shape({
            name: Yup.string().nullable(),
            relationship: Yup.string().nullable(),
            phone: Yup.string()
              .nullable()
              .test('phone-format', t('user:invalid_emergency_phone_format'), (value) => {
                if (!value) {
                  return true; // Optional field
                }
                // Handle international phone format from mui-tel-input
                // Remove any non-digit characters except + at the beginning
                const cleanValue = value.replace(/[^\d+]/g, '');
                // Must start with + and have at least 7 digits (country code + number)
                const phoneRegex = /^\+[1-9]\d{6,14}$/;
                return phoneRegex.test(cleanValue);
              }),
            email: Yup.string().nullable().email(t('user:invalid_emergency_email_format')),
          }),
        });

      case 6: // Preferences
        return Yup.object().shape({
          preferences: Yup.object().shape({
            theme: Yup.string()
              .required(t('user:theme_preference_required'))
              .oneOf(['light', 'dark', 'auto']),
            language: Yup.string().nullable(),
            timezone: Yup.string().nullable(),
          }),
        });

      default:
        return Yup.object().shape({});
    }
  };

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
    profilePicture: Yup.mixed().nullable(),
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
      profilePicture: null,
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
    trigger,
    getValues,
  } = methods;

  // Function to validate a specific step
  const validateStep = async (step: number): Promise<boolean> => {
    try {
      const stepSchema = getStepValidationSchema(step);
      const currentValues = getValues();

      // Get the fields that belong to this step
      const stepFields = getStepFields(step);

      // Validate only the fields for this step
      const stepData = stepFields.reduce((acc, field) => {
        const value = getNestedValue(currentValues, field);
        setNestedValue(acc, field, value);
        return acc;
      }, {});

      await stepSchema.validate(stepData, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Trigger validation for the step fields to show errors
        const stepFields = getStepFields(step);
        await trigger(stepFields as any);

        // Show error message
        const firstError = error.errors[0];
        enqueueSnackbar(firstError, { variant: 'error' });
      }
      return false;
    }
  };

  // Helper function to get fields for each step
  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0: // Personal Information
        return [
          'phoneNumber',
          'gender',
          'dateOfBirth',
          'preferredLanguage',
          'timezone',
          'profilePicture',
          'bio',
        ];
      case 1: // Address
        return ['address', 'city', 'state', 'country', 'postalCode'];
      case 2: // Notifications
        return [
          'notificationPreferences.email',
          'notificationPreferences.sms',
          'notificationPreferences.push',
        ];
      case 3: // Privacy
        return [
          'privacySettings.profileVisibility',
          'privacySettings.showEmail',
          'privacySettings.showPhone',
          'privacySettings.showAddress',
        ];
      case 4: // Social Media
        return [
          'socialMediaLinks.facebook',
          'socialMediaLinks.twitter',
          'socialMediaLinks.linkedin',
          'socialMediaLinks.instagram',
        ];
      case 5: // Emergency Contact
        return [
          'emergencyContact.name',
          'emergencyContact.relationship',
          'emergencyContact.phone',
          'emergencyContact.email',
        ];
      case 6: // Preferences
        return ['preferences.theme', 'preferences.language', 'preferences.timezone'];
      default:
        return [];
    }
  };

  // Helper function to get nested object value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Helper function to set nested object value
  const setNestedValue = (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

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

      // Handle file upload if profile picture is provided
      let profilePictureUrl = null;
      if (data.profilePicture instanceof File) {
        const formData = new FormData();
        formData.append('file', data.profilePicture);

        const uploadResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/uploads', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          profilePictureUrl = uploadResult.data?.url || null;
        }
      }

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
          profile_picture: profilePictureUrl,
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
        router.push(Routes.Auth.CompleteRoleProfile);
      } else {
        enqueueSnackbar(result.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    }
  };

  const handleSkip = () => {
    router.push(Routes.Auth.CompleteRoleProfile);
  };

  return {
    methods,
    isLoading,
    isSubmitting,
    onSubmit: handleSubmit(onSubmit),
    handleSkip,
    validateStep,
  };
};
