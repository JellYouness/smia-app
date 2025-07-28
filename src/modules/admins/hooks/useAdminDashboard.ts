import { useQuery } from '@tanstack/react-query';
import useApi from '@common/hooks/useApi';
import useAuth from '@modules/auth/hooks/api/useAuth';

interface DashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalClients: number;
  totalAmbassadors: number;
  totalProjects: number;
  pendingApplications: number;
  activeProjects: number;
  completedProjects: number;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
    user?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  systemHealth: {
    uptime: number;
    activeConnections: number;
    averageResponseTime: number;
  };
}

export const useAdminDashboard = () => {
  const api = useApi();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await api<DashboardStats>('/admin/dashboard/stats', { method: 'GET' });

      if (!response.success) {
        throw new Error(response.errors?.[0] || 'Failed to fetch dashboard data');
      }

      return response.data!;
    },
    enabled: !!user && (user.userType === 'ADMIN' || user.userType === 'SUPERADMIN'),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};
