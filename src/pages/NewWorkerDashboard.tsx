import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkerSidebar from '@/components/WorkerSidebar';

const NewWorkerDashboard = () => {
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const [jobRequests, setJobRequests] = useState<any[]>([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    pendingRequests: 0,
    totalUsers: 0,
    activeWorkers: 0,
    completedServices: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
      try {
        const session = JSON.parse(userSession);
        fetchWorkerProfile(session.id);
        fetchJobRequests(session.email);
        fetchRecentFeedbacks(session.email);
        fetchMetrics();
      } catch (error) {
        console.error('Error parsing user session:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchWorkerProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('worker_id', parseInt(userId))
        .single();

      if (error) {
        console.error('Error fetching worker profile:', error);
      } else {
        // Transform worker data to match expected format
        const transformedProfile = {
          user_id: data.worker_id,
          designation: data.designation,
          experience_years: data.experience || 0,
          is_verified: true,
          is_available: (data as any).is_available ?? true,
          rating: 4.5,
          total_jobs: Math.floor(Math.random() * 50) + 10,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
          working_hours: data.preferred_working_hours,
          profiles: {
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            city: data.city,
            full_address: data.full_address
          }
        };
        setWorkerProfile({
          ...transformedProfile,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_url: data.profile_url
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchJobRequests = async (workerEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('worker_email', workerEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job requests:', error);
      } else {
        console.log('Fetched job requests:', data); // Debug log
        // Transform service requests to match expected format
        const transformedRequests = data?.map(request => ({
          ...request,
          title: `${request.service_type} Service`,
          location: request.city || request.full_address || 'Location not specified',
          status: request.request_status || 'Pending',
          customer_email: request.user_email,
          preferred_date: request.preferred_date,
          preferred_time: request.preferred_time,
          profiles: {
            first_name: 'Customer',
            last_name: '',
            phone_number: 'Contact via platform'
          }
        })) || [];
        setJobRequests(transformedRequests);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const fetchRecentFeedbacks = async (workerEmail: string) => {
    try {
      console.log('Fetching feedbacks for worker email:', workerEmail); // Debug log
      
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('worker_email', workerEmail)
        .order('submitted_at', { ascending: false })
        .limit(3); // Get only the 3 most recent feedbacks

      if (error) {
        console.error('Error fetching recent feedbacks:', error);
      } else {
        console.log('Fetched feedbacks:', data); // Debug log
        setRecentFeedbacks(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const fetchMetrics = async () => {
    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) return;
      
      const session = JSON.parse(userSession);
      const workerEmail = session.email;

      // Fetch worker-specific pending requests count
      const { count: workerPendingCount } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true })
        .eq('worker_email', workerEmail)
        .eq('request_status', 'Pending');
      
      // Fetch worker-specific accepted requests count
      const { count: workerAcceptedCount } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true })
        .eq('worker_email', workerEmail)
        .eq('request_status', 'Accepted');
      
      // Fetch worker-specific completed services count
      const { count: workerCompletedCount } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true })
        .eq('worker_email', workerEmail)
        .eq('request_status', 'Completed');

      // Fetch worker-specific feedback count
      const { count: feedbackCount } = await supabase
        .from('feedbacks')
        .select('*', { count: 'exact', head: true })
        .eq('worker_email', workerEmail);

      setMetrics({
        pendingRequests: workerPendingCount || 0,
        totalUsers: workerAcceptedCount || 0, // Repurposed as accepted requests
        activeWorkers: workerCompletedCount || 0, // Repurposed as completed services
        completedServices: feedbackCount || 0 // Repurposed as feedback count
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const toggleAvailability = async () => {
    if (!workerProfile) return;

    try {
      const newAvailability = !workerProfile.is_available;
      
      // Update database
      const { error } = await supabase
        .from('workers')
        .update({ is_available: newAvailability } as any)
        .eq('worker_id', workerProfile.user_id);

      if (error) {
        throw error;
      }

      // Update local state
      setWorkerProfile(prev => ({
        ...prev,
        is_available: newAvailability
      }));
      
      toast({
        title: "Availability Updated",
        description: `You are now ${newAvailability ? 'available' : 'unavailable'} for new jobs.`,
      });
    } catch (err) {
      console.error('Error updating availability:', err);
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleJobResponse = async (jobId: number, status: 'Accepted' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ request_status: status })
        .eq('id', jobId);

      if (error) {
        throw error;
      }

      // Update local state
      setJobRequests(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status, request_status: status } : job
        )
      );

      toast({
        title: `Request ${status}`,
        description: `You have ${status.toLowerCase()} the service request.`,
      });

      // Refresh metrics after updating job status
      fetchMetrics();
    } catch (err) {
      console.error('Error updating job status:', err);
      toast({
        title: "Error",
        description: "Failed to update request status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading || !workerProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getDesignationIcon = (designation: string) => {
    const icons: { [key: string]: string } = {
      plumber: '🔧',
      electrician: '⚡',
      photographer: '📸',
      videographer: '🎥',
      carpenter: '🔨',
      cleaner: '🧽',
      painter: '🎨'
    };
    return icons[designation] || '⚙️';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const metricsData = [
    { title: 'Pending Requests', value: metrics.pendingRequests.toString(), color: 'warning' },
    { title: 'Accepted Requests', value: metrics.totalUsers.toString(), color: 'info' },
    { title: 'Completed Services', value: metrics.activeWorkers.toString(), color: 'success' },
    { title: 'Customer Reviews', value: metrics.completedServices.toString(), color: 'success' },
  ];

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
    <WorkerSidebar>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Worker Dashboard</h1>
              <p className="text-muted-foreground hidden sm:block">
                Welcome back, {workerProfile?.first_name}! Manage your services and requests.
              </p>
            </div>
            
            {/* Worker Status Card */}
            <Card className="w-full sm:w-auto">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                    {workerProfile?.profile_url ? (
                      <img
                        src={workerProfile.profile_url}
                        alt="Your profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cta-primary/20 to-cta-primary/30 flex items-center justify-center text-lg">
                        {getDesignationIcon(workerProfile?.designation || '')}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-semibold text-foreground">
                      {workerProfile?.first_name} {workerProfile?.last_name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {workerProfile?.designation} • {workerProfile?.profiles?.city}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        workerProfile?.is_available ? 'bg-success' : 'bg-muted-foreground'
                      }`}></span>
                      <span className="text-sm text-muted-foreground">
                        {workerProfile?.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <button
                      onClick={toggleAvailability}
                      className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        workerProfile?.is_available
                          ? 'bg-muted text-foreground hover:bg-muted/80'
                          : 'bg-cta-primary text-cta-primary-foreground hover:bg-cta-primary-hover'
                      }`}
                    >
                      {workerProfile?.is_available ? 'Go Unavailable' : 'Go Available'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {metricsData.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                  {metric.title}
                </h3>
                <p className={`text-2xl sm:text-3xl font-bold ${getMetricColorClass(metric.color)}`}>
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Requests Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Job Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cta-primary"></div>
                  <span className="ml-3 text-muted-foreground">Loading job requests...</span>
                </div>
              ) : jobRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-lg">No job requests found</p>
                  <p className="text-muted-foreground text-sm">New requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {jobRequests.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{job.service_type}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      {job.description && (
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                      
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                         <div>
                           <span className="text-muted-foreground">Date: </span>
                           <span className="text-foreground">{job.preferred_date || 'Not specified'}</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">Time: </span>
                           <span className="text-foreground">{job.preferred_time || 'Not specified'}</span>
                         </div>
                         <div className="md:col-span-2">
                           <span className="text-muted-foreground">Customer: </span>
                           <span className="text-foreground">{job.user_email}</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">Phone: </span>
                           <span className="text-foreground">{job.phone_number || 'Not provided'}</span>
                         </div>
                         <div>
                           <span className="text-muted-foreground">City: </span>
                           <span className="text-foreground">{job.city}</span>
                         </div>
                         <div className="md:col-span-2">
                           <span className="text-muted-foreground">Full Address: </span>
                           <span className="text-foreground">{job.full_address}</span>
                         </div>
                       </div>
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        Requested: {new Date(job.created_at).toLocaleDateString()}
                      </div>
                      
                      {job.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleJobResponse(job.id, 'Accepted')}
                            className="bg-success hover:bg-success/90 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleJobResponse(job.id, 'Rejected')}
                            className="bg-destructive hover:bg-destructive/90 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Feedbacks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Feedbacks
                <span className="text-sm font-normal text-muted-foreground">
                  {recentFeedbacks.length} reviews
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {console.log('Rendering feedbacks, count:', recentFeedbacks.length)} {/* Debug log */}
              {recentFeedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-muted-foreground">No feedback yet</p>
                  <p className="text-muted-foreground text-sm">Customer reviews will appear here</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Debug: Worker email from session should match feedbacks.worker_email
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentFeedbacks.map((feedback) => (
                    <div 
                      key={feedback.id} 
                      className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-foreground text-sm">{feedback.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{feedback.email}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground mb-2 line-clamp-3">
                        {feedback.message}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(feedback.submitted_at).toLocaleDateString()} • 
                        Service Request #{feedback.service_request_id}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {recentFeedbacks.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <button 
                    onClick={() => navigate('/worker/feedbacks')}
                    className="text-sm text-cta-primary hover:text-cta-primary-hover font-medium"
                  >
                    View all feedbacks →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkerSidebar>
  );
};

export default NewWorkerDashboard;