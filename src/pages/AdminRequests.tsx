import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
      } else {
        setRequests(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminSidebar>
      <div className="p-2 sm:p-3 lg:p-4">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">Service Requests</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
            Manage all service requests on the platform
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cta-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading requests...</span>
          </div>
        ) : (
          <div className="bg-card rounded-md border">
            <div className="p-3 border-b border-border">
              <h2 className="text-sm sm:text-base font-medium text-foreground">
                All Service Requests ({requests.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Service</TableHead>
                    <TableHead className="min-w-[120px]">Customer</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Worker</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">Location</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                        No service requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground text-xs">
                              {request.service_type}
                            </div>
                            {request.description && (
                              <div className="text-[10px] text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">
                                {request.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-foreground break-all">
                            {request.user_email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="text-xs font-medium text-foreground break-all">
                            {request.worker_email || 'Not assigned'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(request.request_status)}`}>
                            {request.request_status || 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs text-muted-foreground">
                            <div>{request.city}</div>
                            {request.full_address && (
                              <div className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                                {request.full_address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-xs text-muted-foreground">
                            <div>{new Date(request.created_at).toLocaleDateString()}</div>
                            {request.preferred_date && (
                              <div className="text-[10px] text-muted-foreground">
                                Preferred: {new Date(request.preferred_date).toLocaleDateString()}
                                {request.preferred_time && (
                                  <span className="block">{request.preferred_time}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminRequests;
