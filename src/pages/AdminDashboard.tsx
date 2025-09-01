import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState([
    { id: 'pendingRequests', title: 'Pending Requests', value: '0', color: 'warning' },
    { id: 'totalUsers', title: 'Total Users', value: '0', color: 'info' },
    { id: 'activeProviders', title: 'Active Providers', value: '0', color: 'success' },
    { id: 'completedServices', title: 'Completed Services', value: '0', color: 'success' },
  ]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        { count: pendingCount },
        { count: usersCount },
        { count: workersCount },
        { count: completedCount },
        { data: requests },
        { data: users }
      ] = await Promise.all([
        supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('workers').select('*', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'Completed'),
        supabase.from('service_requests').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('users').select('first_name, last_name, email, created_at').order('id', { ascending: false }).limit(4)
      ]);

      setMetrics([
        { id: 'pendingRequests', title: 'Pending Requests', value: (pendingCount || 0).toString(), color: 'warning' },
        { id: 'totalUsers', title: 'Total Users', value: (usersCount || 0).toString(), color: 'info' },
        { id: 'activeProviders', title: 'Active Providers', value: (workersCount || 0).toString(), color: 'success' },
        { id: 'completedServices', title: 'Completed Services', value: (completedCount || 0).toString(), color: 'success' },
      ]);

      setRecentRequests(requests || []);
      setRecentUsers(users || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricColorClass = (color: string) => {
    switch (color) {
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      case 'success':
        return 'text-success';
      default:
        return 'text-foreground';
    }
  };

  return (
    <AdminSidebar>
      <div className="p-3 sm:p-4 lg:p-5" id="adminMainContent">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-1" id="adminDashboardTitle">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Welcome back! Here's what's happening with ConnectPro today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5"
          id="metricsGrid"
        >
          {metrics.map((metric) => (
            <div
              key={metric.id}
              id={metric.id}
              className="bg-card p-3 sm:p-4 rounded-md shadow-sm border border-border 
                         transition-transform duration-300 hover:scale-105 hover:shadow-md"
            >
              <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-1">
                {metric.title}
              </h3>
              <p className={`text-lg sm:text-xl font-bold ${getMetricColorClass(metric.color)}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
          {/* Recent Requests */}
          <div className="bg-card p-3 sm:p-4 rounded-md shadow-sm border border-border" id="recentRequests">
            <h2 className="text-sm sm:text-base font-semibold text-card-foreground mb-3">
              Recent Service Requests
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="text-center text-xs text-muted-foreground">Loading...</div>
              ) : recentRequests.length > 0 ? (
                recentRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-muted rounded-md gap-1 sm:gap-0"
                    id={`requestItem${index + 1}`}
                  >
                    <div>
                      <p className="font-medium text-foreground text-xs sm:text-sm">{request.service_type}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        {request.user_email} • {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium self-start sm:self-auto ${
                        request.status === 'Pending'
                          ? 'bg-warning/20 text-warning'
                          : request.status === 'Accepted'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      {request.status || 'Pending'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-muted-foreground">No recent requests</div>
              )}
            </div>
            <Link
              to="/admin/requests"
              className="block mt-3 text-center text-cta-primary hover:text-cta-primary-hover text-xs font-medium"
              id="viewAllRequestsLink"
            >
              View All Requests →
            </Link>
          </div>

          {/* Recent Users */}
          <div className="bg-card p-3 sm:p-4 rounded-md shadow-sm border border-border" id="recentUsers">
            <h2 className="text-sm sm:text-base font-semibold text-card-foreground mb-3">
              Recently Registered Users
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="text-center text-xs text-muted-foreground">Loading...</div>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user, index) => (
                  <div
                    key={user.email}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-muted rounded-md gap-1 sm:gap-0"
                    id={`userItem${index + 1}`}
                  >
                    <div>
                      <p className="font-medium text-foreground text-xs sm:text-sm">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        {user.email} • Joined{' '}
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : 'Recently'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-success/20 text-success rounded-full text-[10px] font-medium self-start sm:self-auto">
                      Active
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-muted-foreground">No recent users</div>
              )}
            </div>
            <Link
              to="/admin/users"
              className="block mt-3 text-center text-cta-primary hover:text-cta-primary-hover text-xs font-medium"
              id="viewAllUsersLink"
            >
              View All Users →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 bg-card p-3 sm:p-4 rounded-md shadow-sm border border-border" id="quickActions">
          <h2 className="text-sm sm:text-base font-semibold text-card-foreground mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <button
              id="approveProvidersBtn"
              className="p-3 text-left bg-muted hover:bg-muted/80 rounded-md transition-colors duration-200"
            >
              <h3 className="font-medium text-foreground mb-0.5 text-xs sm:text-sm">Approve Providers</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Review and approve new service providers</p>
            </button>

            <button
              id="manageServicesBtn"
              className="p-3 text-left bg-muted hover:bg-muted/80 rounded-md transition-colors duration-200"
            >
              <h3 className="font-medium text-foreground mb-0.5 text-xs sm:text-sm">Manage Services</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Add or edit available service categories</p>
            </button>

            <button
              id="systemSettingsBtn"
              className="p-3 text-left bg-muted hover:bg-muted/80 rounded-md transition-colors duration-200"
            >
              <h3 className="font-medium text-foreground mb-0.5 text-xs sm:text-sm">System Settings</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Configure platform settings and preferences</p>
            </button>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
};

export default AdminDashboard;
