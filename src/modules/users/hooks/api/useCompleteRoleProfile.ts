import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';
import { useCompleteCreatorProfile } from '@modules/auth/hooks/api/useCompleteCreatorProfile';
import { useCompleteClientProfile } from '@modules/auth/hooks/api/useCompleteClientProfile';
import { Any } from '@common/defs/types';

interface CreatorProfileFormData {
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

interface ClientProfileFormData {
  companyName: string;
  companySize: string;
  industry: string;
  websiteUrl: string;
  budget: string;
  projectCount: number;
  billingAddress: string;
  taxIdentifier: string;
  preferredCreators: string[];
  defaultProjectSettings: {
    defaultBudget: string;
    defaultTimeline: string;
    defaultRequirements: string;
  };
  preferredProjectTypes: string[];
  preferredTimeline: string;
}

type RoleProfileFormData = CreatorProfileFormData | ClientProfileFormData;

export const useCompleteRoleProfile = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { completeCreatorProfile, isSubmitting: isCreatorSubmitting } = useCompleteCreatorProfile();
  const { completeClientProfile, isSubmitting: isClientSubmitting } = useCompleteClientProfile();

  const isCreator = !!user?.creator;
  const isClient = !!user?.client;

  // Step-specific validation schemas
  const getStepValidationSchema = (step: number, isCreator: boolean) => {
    if (isCreator) {
      switch (step) {
        case 0: // Basic Information
          return Yup.object().shape({
            title: Yup.string().max(255, 'Title is too long'),
            bio: Yup.string().max(1000, 'Bio is too long'),
            shortBio: Yup.string().max(255, 'Short bio is too long'),
            hourlyRate: Yup.number()
              .typeError('Hourly rate must be a number')
              .min(0, 'Hourly rate must be at least 0')
              .nullable(),
          });
        case 1: // Skills
          return Yup.object().shape({
            skills: Yup.array().of(Yup.string()).min(1, 'At least one skill is required'),
          });
        case 2: // Portfolio
          return Yup.object().shape({
            portfolio: Yup.array().of(
              Yup.object().shape({
                title: Yup.string().required('Title is required'),
                description: Yup.string().required('Description is required'),
                url: Yup.string().url('Must be a valid URL'),
              })
            ),
          });
        case 3: // Experience
          return Yup.object().shape({
            experience: Yup.array().of(
              Yup.object().shape({
                title: Yup.string().required('Title is required'),
                company: Yup.string().required('Company is required'),
                duration: Yup.string().required('Duration is required'),
                description: Yup.string().required('Description is required'),
              })
            ),
          });
        case 4: // Preferences
          return Yup.object().shape({
            availability: Yup.string().required('Availability is required'),
            preferredProjectTypes: Yup.array()
              .of(Yup.string())
              .min(1, 'At least one project type is required'),
            preferredBudgetRange: Yup.string().required('Preferred budget range is required'),
            preferredTimeline: Yup.string().required('Preferred timeline is required'),
          });
        default:
          return Yup.object().shape({});
      }
    } else {
      switch (step) {
        case 0: // Company Information
          return Yup.object().shape({
            companyName: Yup.string().required('Company name is required'),
            companySize: Yup.string().required('Company size is required'),
            industry: Yup.string().required('Industry is required'),
            websiteUrl: Yup.string().url('Must be a valid URL'),
            budget: Yup.string().required('Budget is required'),
            projectCount: Yup.number().min(0, 'Project count must be at least 0'),
          });
        case 1: // Preferences
          return Yup.object().shape({
            preferredProjectTypes: Yup.array()
              .of(Yup.string())
              .min(1, 'At least one project type is required'),
            preferredTimeline: Yup.string().required('Preferred timeline is required'),
          });
        default:
          return Yup.object().shape({});
      }
    }
  };

  // Create appropriate schema based on user type
  const ProfileSchema = isCreator
    ? Yup.object().shape({
        title: Yup.string().max(255, 'Title is too long'),
        bio: Yup.string().max(1000, 'Bio is too long'),
        shortBio: Yup.string().max(255, 'Short bio is too long'),
        hourlyRate: Yup.number()
          .typeError('Hourly rate must be a number')
          .min(0, 'Hourly rate must be at least 0')
          .nullable(),
        skills: Yup.array().of(Yup.string()),
        portfolio: Yup.array().of(
          Yup.object().shape({
            title: Yup.string(),
            description: Yup.string(),
            url: Yup.string().url('Must be a valid URL'),
          })
        ),
        experience: Yup.array().of(
          Yup.object().shape({
            title: Yup.string(),
            company: Yup.string(),
            duration: Yup.string(),
            description: Yup.string(),
          })
        ),
        certifications: Yup.array().of(
          Yup.object().shape({
            name: Yup.string(),
            issuer: Yup.string(),
            year: Yup.string(),
            url: Yup.string().url('Must be a valid URL'),
          })
        ),
        achievements: Yup.array().of(Yup.string()),
        equipment: Yup.array().of(
          Yup.object().shape({
            name: Yup.string(),
            description: Yup.string(),
          })
        ),
        regionalExpertise: Yup.array().of(Yup.string()),
        mediaTypes: Yup.array().of(Yup.string()),
        availability: Yup.string(),
        preferredProjectTypes: Yup.array().of(Yup.string()),
        preferredBudgetRange: Yup.string(),
        preferredTimeline: Yup.string(),
      })
    : Yup.object().shape({
        companyName: Yup.string().required('Company name is required'),
        companySize: Yup.string().required('Company size is required'),
        industry: Yup.string().required('Industry is required'),
        websiteUrl: Yup.string().url('Must be a valid URL'),
        budget: Yup.string().required('Budget is required'),
        projectCount: Yup.number().min(0, 'Project count must be at least 0'),
        billingAddress: Yup.string(),
        taxIdentifier: Yup.string(),
        preferredCreators: Yup.array().of(Yup.string()),
        defaultProjectSettings: Yup.object().shape({
          defaultBudget: Yup.string(),
          defaultTimeline: Yup.string(),
          defaultRequirements: Yup.string(),
        }),
        preferredProjectTypes: Yup.array().of(Yup.string()),
        preferredTimeline: Yup.string(),
      });

  const methods = useForm<RoleProfileFormData>({
    resolver: yupResolver(ProfileSchema),
    defaultValues: isCreator
      ? {
          title: user?.creator?.title || '',
          bio: user?.creator?.bio || '',
          shortBio: user?.creator?.shortBio || '',
          hourlyRate: user?.creator?.hourlyRate || null,
          skills: user?.creator?.skills || [],
          portfolio: user?.creator?.portfolio || [],
          experience: user?.creator?.professionalBackground || [],
          certifications: user?.creator?.certifications || [],
          achievements: user?.creator?.achievements || [],
          equipment: user?.creator?.equipmentInfo
            ? [
                { name: 'Cameras', description: user.creator.equipmentInfo.cameras.join(', ') },
                { name: 'Lenses', description: user.creator.equipmentInfo.lenses.join(', ') },
                { name: 'Audio', description: user.creator.equipmentInfo.audio.join(', ') },
                { name: 'Lighting', description: user.creator.equipmentInfo.lighting.join(', ') },
              ]
            : [],
          regionalExpertise: user?.creator?.regionalExpertise?.map((re) => re.region) || [],
          mediaTypes: user?.creator?.mediaTypes?.map((mt) => mt.toLowerCase()) || [],
          availability: user?.creator?.availability || '',
          preferredProjectTypes: user?.creator?.preferredProjectTypes || [],
          preferredTimeline: user?.creator?.preferredTimeline || '',
        }
      : {
          companyName: user?.client?.companyName || '',
          companySize: user?.client?.companySize || '',
          industry: user?.client?.industry || '',
          websiteUrl: user?.client?.websiteUrl || '',
          budget: user?.client?.budget || '',
          projectCount: user?.client?.projectCount || 0,
          billingAddress: `${user?.client?.billingStreet || ''}, ${
            user?.client?.billingCity || ''
          }, ${user?.client?.billingState || ''} ${user?.client?.billingPostalCode || ''}`,
          taxIdentifier: user?.client?.taxIdentifier || '',
          preferredCreators: user?.client?.preferredCreators?.map((id) => id.toString()) || [],
          defaultProjectSettings: {
            defaultBudget: user?.client?.defaultProjectSettings?.timeline || '',
            defaultTimeline: user?.client?.defaultProjectSettings?.timeline || '',
            defaultRequirements: '',
          },
          preferredProjectTypes: user?.client?.preferredProjectTypes || [],
          preferredTimeline: user?.client?.preferredTimeline || '',
        },
  });

  const { handleSubmit, getValues } = methods;

  // Function to validate a specific step
  const validateStep = async (step: number) => {
    const schema = getStepValidationSchema(step, isCreator);
    const currentValues = getValues();

    try {
      await schema.validate(currentValues, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) {
            methods.setError(err.path as Any, {
              type: 'manual',
              message: err.message,
            });
          }
        });
      }
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      // Check if user already has a complete role profile
      if (isCreator && user.creator?.isProfileComplete) {
        router.push(Routes.Users.Me);
        return;
      }
      if (isClient && user.client?.isProfileComplete) {
        router.push(Routes.Users.Me);
        return;
      }

      setIsLoading(false);
    }
  }, [user, router, isCreator, isClient]);

  const onSubmit = async (data: RoleProfileFormData) => {
    if (isCreator) {
      await completeCreatorProfile(data as CreatorProfileFormData);
    } else {
      await completeClientProfile(data as ClientProfileFormData);
    }
  };

  const handleSkip = () => {
    router.push(Routes.Users.Me);
  };

  return {
    methods,
    isLoading,
    isSubmitting: isCreatorSubmitting || isClientSubmitting,
    onSubmit: handleSubmit(onSubmit),
    handleSkip,
    validateStep,
    user,
  };
};
