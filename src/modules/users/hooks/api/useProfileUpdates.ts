import { useState } from 'react';
import useApi, { ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import ApiRoutes from '@common/defs/api-routes';
import { Any } from '@common/defs/types';

interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: Any;
}

const useProfileUpdates = () => {
  const fetchApi = useApi();
  const [loading, setLoading] = useState(false);

  const updateAbout = async (
    userId: number,
    data: { title?: string; bio?: string },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateAbout.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data,
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolio = async (
    userId: number,
    portfolio: Array<{
      title: string;
      description: string;
      url: string;
    }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdatePortfolio.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { portfolio },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateSkills = async (
    userId: number,
    skills: string[],
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateSkills.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { skills },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateCertifications = async (
    userId: number,
    certifications: Array<{
      title: string;
      issuer: string;
      date: string;
    }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateCertifications.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { certifications },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployment = async (
    userId: number,
    professionalBackground: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateEmployment.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { professionalBackground },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateAchievements = async (
    userId: number,
    achievements: string[],
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateAchievements.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { achievements },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (
    userId: number,
    equipmentInfo: {
      [category: string]: string[];
    },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateEquipment.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { equipmentInfo },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateRegionalExpertise = async (
    userId: number,
    regionalExpertise: Array<{
      region: string;
      expertiseLevel: string;
    }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      console.log('updateRegionalExpertise called with:', { userId, regionalExpertise });
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateRegionalExpertise.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { regionalExpertise },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateMediaTypes = async (
    userId: number,
    mediaTypes: string[],
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateMediaTypes.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { mediaTypes },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateLanguages = async (
    userId: number,
    languages: Array<{
      language: string;
      proficiency: string;
    }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateLanguages.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { languages },
          ...options,
        }
      );
      // Fallback: parse if string
      if (response.data && typeof response.data?.data?.languages === 'string') {
        response.data.data.languages = JSON.parse(response.data.data.languages);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (
    userId: number,
    education: Array<{
      year: string;
      field: string;
      degree: string;
      institution: string;
    }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateEducation.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { education },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Client-specific update methods
  const updateCompany = async (
    userId: number,
    companyData: {
      company_name: string;
      company_size: string;
      industry: string;
      website_url?: string;
    },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateCompany.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: companyData,
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateBilling = async (
    userId: number,
    billingData: {
      billing_street: string;
      billing_city: string;
      billing_state: string;
      billing_postal_code: string;
      billing_country: string;
      tax_identifier?: string;
    },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateBilling.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: billingData,
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (
    userId: number,
    budget: string,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateBudget.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { budget },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateProjectSettings = async (
    userId: number,
    projectSettings: {
      budget?: number;
      timeline?: string;
      requirements?: string;
    },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateProjectSettings.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { default_project_settings: projectSettings },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Add new update methods for client profile sections
  const updateBudgetProjects = async (
    userId: number,
    data: {
      budget: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
      projectCount: number;
      preferredCreators: number[];
    },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      // Update budget
      await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateBudget.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: { budget: data.budget },
          ...options,
        }
      );
      // Update preferred creators and project count (assuming a PATCH to UpdateOne)
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateOne.replace('{id}', userId.toString()),
        {
          method: 'PATCH',
          data: {
            client: {
              preferredCreators: data.preferredCreators,
              projectCount: data.projectCount,
            },
          },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateDefaultProjectSettings = async (
    userId: number,
    data: { notificationFrequency: string; timeline: string; communicationPreference: string },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateProjectSettings.replace('{id}', userId.toString()),
        {
          method: 'PUT',
          data: {
            default_project_settings: {
              notificationFrequency: data.notificationFrequency,
              timeline: data.timeline,
              communicationPreference: data.communicationPreference,
            },
          },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = async (
    userId: number,
    data: { contactPhone: string; contactEmail: string; city: string; country: string },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(
        ApiRoutes.Users.UpdateOne.replace('{id}', userId.toString()),
        {
          method: 'PATCH',
          data: {
            profile: {
              contactPhone: data.contactPhone,
              contactEmail: data.contactEmail,
              city: data.city,
              country: data.country,
            },
          },
          ...options,
        }
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Add updateClientLanguages for client language JSON array
  const updateClientLanguages = async (
    userId: number,
    languages: Array<{ language: string; proficiency: string }>,
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(`/users/${userId}/client-languages`, {
        method: 'PUT',
        data: { languages },
        ...options,
      });
      // Fallback: parse if string
      if (response.data && typeof response.data?.data?.languages === 'string') {
        response.data.data.languages = JSON.parse(response.data.data.languages);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateSocialMedia = async (
    userId: number,
    data: { socialMediaLinks: Array<{ platform: string; url: string }> },
    options?: FetchApiOptions
  ): Promise<ApiResponse<ProfileUpdateResponse>> => {
    setLoading(true);
    try {
      const response = await fetchApi<ProfileUpdateResponse>(`/users/${userId}/social-media`, {
        method: 'PATCH',
        data: { profile: { socialMediaLinks: data.socialMediaLinks } },
        ...options,
      });
      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateAbout,
    updatePortfolio,
    updateSkills,
    updateCertifications,
    updateEmployment,
    updateAchievements,
    updateEquipment,
    updateRegionalExpertise,
    updateMediaTypes,
    updateLanguages,
    updateEducation,
    updateCompany,
    updateBilling,
    updateBudget,
    updateProjectSettings,
    updateBudgetProjects,
    updateDefaultProjectSettings,
    updateContactInfo,
    updateClientLanguages,
    updateSocialMedia,
  };
};

export default useProfileUpdates;
