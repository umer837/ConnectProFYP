import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';

const AdminProviders = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase.from('workers').select('*');

      if (error) {
        console.error('Error fetching providers:', error);
      } else {
        const transformedProviders = data?.map((worker: any) => ({
          id: worker.worker_id,
          first_name: worker.first_name,
          last_name: worker.last_name,
          phone_number: worker.phone_number,
          city: worker.city,
          designation: worker.designation,
          experience_years: worker.experience || 0,
          is_verified: worker.is_approved || false,
          is_available: worker.is_available || true,
          rating: 4.5,
          total_jobs: Math.floor(Math.random() * 50) + 10,
        })) || [];

        setProviders(transformedProviders);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProviderStatus = async (providerId: string, isVerified: boolean) => {
    try {
      const { data, error } = await supabase
  .from('workers')
  .update({ is_approved: isVerified })
  .eq('worker_id', parseInt(providerId));

console.log('Update result:', data, error);

      if (error) {
        console.error('Error updating provider status:', error);
        return;
      }

      // Update state locally
      setProviders(prev =>
        prev.map(provider =>
          provider.id === providerId
            ? { ...provider, is_verified: isVerified }
            : provider
        )
      );
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Service Providers</h1>
          <p className="text-muted-foreground mt-2 hidden sm:block">
            Approve and manage service providers on the platform
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading providers...</span>
          </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                All Service Providers ({providers.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Designation
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Experience
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Rating
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {providers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 sm:px-6 py-8 text-center text-muted-foreground">
                        No service providers found
                      </td>
                    </tr>
                  ) : (
                    providers.map((provider) => (
                      <tr key={provider.id} className="hover:bg-muted/50">
                        <td className="px-3 sm:px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {provider.first_name} {provider.last_name}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {provider.phone_number}
                            </div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {provider.designation} • {provider.city}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                          <div className="text-sm text-foreground">
                            {provider.designation}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {provider.city}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                          {provider.experience_years} years
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              provider.is_verified
                                ? 'bg-success/20 text-success'
                                : 'bg-warning/20 text-warning'
                            }`}>
                              {provider.is_verified ? 'Verified' : 'Pending'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              provider.is_available
                                ? 'bg-info/20 text-info'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {provider.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                          <div className="text-sm text-foreground">
                            ⭐ {provider.rating || '0.00'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {provider.total_jobs} jobs
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          {!provider.is_verified ? (
                            <button
                              onClick={() => updateProviderStatus(provider.id, true)}
                              className="bg-success hover:bg-success/90 text-white px-2 sm:px-3 py-1 rounded text-xs font-medium"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => updateProviderStatus(provider.id, false)}
                              className="bg-cta-primary hover:bg-cta-primary-hover text-white px-2 sm:px-3 py-1 rounded text-xs font-medium"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminProviders;
