import ApiRoutes from '@common/defs/api-routes';
import useApi, { ApiOptions, ApiResponse, FetchApiOptions } from '@common/hooks/useApi';
import { User } from '@modules/users/defs/types';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const convertToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertToSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = toSnakeCase(key);
      const value = obj[key];
      result[snakeKey] = typeof value === 'object' ? convertToSnakeCase(value) : value;
      return result;
    }, {} as any);
  }
  return obj;
};

export interface LoginInput {
  email: string;
  password: string;
  admin?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  userType: 'client' | 'creator';
  // Creator-specific fields
  skills?: string[];
  mediaTypes?: string[];
  experienceLevel?: string;
  regions?: string[];
  languages?: Array<{ language: string; proficiency: string }>;
  biography?: string;
  termsAccepted: boolean;
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  token: string;
}

export interface VerifyEmailInput {
  id: number;
  hash: string;
}

export interface ResendEmailVerificationInput {
  email: string;
}

interface AuthData {
  user: User | null;
  login: (
    _input: LoginInput,
    _options?: FetchApiOptions
  ) => Promise<ApiResponse<{ token: string }>>;
  register: (
    _input: RegisterInput,
    _options?: FetchApiOptions
  ) => Promise<ApiResponse<{ token?: string; user_id?: number }>>;
  logout: (_options?: FetchApiOptions) => Promise<ApiResponse<null>>;
  requestPasswordReset: (
    _input: RequestPasswordResetInput,
    _options?: FetchApiOptions
  ) => Promise<ApiResponse<null>>;
  resetPassword: (
    _input: ResetPasswordInput,
    _options?: FetchApiOptions
  ) => Promise<ApiResponse<{ token: string }>>;
  verifyEmail: (
    _input: VerifyEmailInput,
    _options?: FetchApiOptions
  ) => Promise<ApiResponse<{ token: string }>>;
  resendEmailVerification: (
    _input: ResendEmailVerificationInput,
    _options?: FetchApiOptions
  ) => Promise<ApiResponse<null>>;
  initialized: boolean; // This is used to prevent the app from rendering before the useAuth initial fetch is complete
}

const useAuth = (): AuthData => {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
  if (!authEnabled) {
    return {
      initialized: true,
      user: null,
      login: async () => ({ success: false, errors: ['Auth is disabled'] }),
      register: async () => ({ success: false, errors: ['Auth is disabled'] }),
      logout: async () => ({ success: false, errors: ['Auth is disabled'] }),
      requestPasswordReset: async () => ({ success: false, errors: ['Auth is disabled'] }),
      resetPassword: async () => ({ success: false, errors: ['Auth is disabled'] }),
      verifyEmail: async () => ({ success: false, errors: ['Auth is disabled'] }),
      resendEmailVerification: async () => ({ success: false, errors: ['Auth is disabled'] }),
    };
  }

  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchApi = useApi();

  const { data: user, mutate } = useSWR<User | null>(ApiRoutes.Auth.Me, async (url) => {
    if (!localStorage.getItem('authToken')) {
      setInitialized(true);
      return null;
    }
    const options: ApiOptions = {
      method: 'POST',
    };
    const response = await fetchApi<{ user: User }>(url, options);
    const { success, data } = response;
    let returnedUser = null;
    if (!success) {
      localStorage.removeItem('authToken');
    } else {
      returnedUser = data?.user ?? null;
    }
    setInitialized(true);
    return returnedUser;
  });

  // Ensure initialized is set if user is present but fetcher didn't run
  useEffect(() => {
    if (user !== undefined && !initialized) {
      setInitialized(true);
    }
  }, [user, initialized]);

  const login = async (input: LoginInput, options?: FetchApiOptions) => {
    const response = await fetchApi<{ token: string }>(ApiRoutes.Auth.Login, {
      data: input,
      ...options,
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      mutate();
    }

    return response;
  };

  const register = async (input: RegisterInput, options?: FetchApiOptions) => {
    const snakeCaseData = convertToSnakeCase(input);
    const response = await fetchApi<{ token?: string; user_id?: number }>(ApiRoutes.Auth.Register, {
      data: snakeCaseData,
      ...options,
    });

    // Only set token if it's returned (for email verification)
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      mutate();
    }

    return response;
  };

  const logout = async (options?: FetchApiOptions) => {
    const response = await fetchApi<null>(ApiRoutes.Auth.Logout, { method: 'POST', ...options });
    localStorage.removeItem('authToken');
    mutate();
    return response;
  };

  const requestPasswordReset = async (
    input: RequestPasswordResetInput,
    options?: FetchApiOptions
  ) => {
    const response = await fetchApi<null>(ApiRoutes.Auth.RequestPasswordReset, {
      data: input,
      ...options,
    });
    return response;
  };

  const resetPassword = async (input: ResetPasswordInput, options?: FetchApiOptions) => {
    const response = await fetchApi<{ token: string }>(ApiRoutes.Auth.ResetPassword, {
      data: input,
      ...options,
    });
    return response;
  };

  const verifyEmail = async (input: VerifyEmailInput, options?: FetchApiOptions) => {
    const response = await fetchApi<{ token: string }>(
      `${ApiRoutes.Auth.VerifyEmail}/${input.id}/${input.hash}`,
      {
        method: 'GET',
        ...options,
      }
    );
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      mutate();
    }

    return response;
  };

  const resendEmailVerification = async (
    input: ResendEmailVerificationInput,
    options?: FetchApiOptions
  ) => {
    const response = await fetchApi<null>(ApiRoutes.Auth.ResendEmailVerification, {
      data: input,
      ...options,
    });
    return response;
  };

  return {
    user: user ?? null,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendEmailVerification,
    initialized,
  };
};

export default useAuth;
