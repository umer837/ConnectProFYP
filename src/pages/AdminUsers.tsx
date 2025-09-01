import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        // Transform users data to include user_type
        const transformedUsers = data?.map(user => ({
          ...user,
          user_type: 'user', // Default type
          created_at: new Date().toISOString() // Default timestamp
        })) || [];
        setUsers(transformedUsers);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-2 hidden sm:block">
            Manage all registered users on the platform
          </p>
        </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading users...</span>
            </div>
        ) : (
          <div className="bg-card rounded-lg border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                All Users ({users.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      City
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-6 py-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {user.phone_number || 'No phone'} • {user.city || 'No city'}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.user_type === 'admin' 
                              ? 'bg-cta-primary/20 text-cta-primary'
                              : user.user_type === 'worker' 
                              ? 'bg-info/20 text-info' 
                              : 'bg-success/20 text-success'
                          }`}>
                            {user.user_type || 'user'}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                          {user.phone_number || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                          {user.city || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(user.created_at).toLocaleDateString()}
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

export default AdminUsers;