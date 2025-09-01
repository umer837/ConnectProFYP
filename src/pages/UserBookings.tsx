import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserSidebar from '@/components/UserSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReviewForm from '@/components/ReviewForm';

interface ServiceRequest {
  id: number;
  service_type: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  city: string;
  full_address: string;
  worker_email: string;
  request_status: string;
  created_at: string;
}

interface Feedback {
  id: number;
  service_request_id: number;
}

const UserBookings = () => {
  const [bookings, setBookings] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingFeedbacks, setExistingFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchExistingFeedbacks();
  }, []);

  const fetchBookings = async () => {
    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) return;

      const session = JSON.parse(userSession);
      const userEmail = session.email;

      if (!userEmail) return;

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingFeedbacks = async () => {
    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) return;

      const session = JSON.parse(userSession);
      const userEmail = session.email;

      if (!userEmail) return;

      const { data, error } = await supabase
        .from('feedbacks')
        .select('id, service_request_id')
        .eq('email', userEmail);

      if (error) {
        console.error('Error fetching existing feedbacks:', error);
      } else {
        setExistingFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const hasReviewed = (serviceRequestId: number) => {
    return existingFeedbacks.some(feedback => feedback.service_request_id === serviceRequestId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your service requests</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No bookings found</p>
              <p className="text-muted-foreground">Book your first service from the Dashboard</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="w-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{booking.service_type}</CardTitle>
                      <Badge className={`${getStatusColor(booking.request_status)} text-white`}>
                        {booking.request_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Worker Email</p>
                        <p className="text-foreground">{booking.worker_email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Preferred Date</p>
                        <p className="text-foreground">{booking.preferred_date || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Preferred Time</p>
                        <p className="text-foreground">{booking.preferred_time || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-foreground">{booking.city}</p>
                      </div>
                    </div>
                    {booking.description && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-foreground">{booking.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Address</p>
                      <p className="text-foreground">{booking.full_address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Booked On</p>
                      <p className="text-foreground">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    {booking.request_status.toLowerCase() === 'accepted' && !hasReviewed(booking.id) && (
                      <div className="pt-4 border-t">
                        <ReviewForm
                          serviceRequestId={booking.id}
                          workerEmail={booking.worker_email}
                          onReviewSubmitted={() => {
                            fetchExistingFeedbacks();
                            fetchBookings(); // Also refresh bookings to see status update
                          }}
                        />
                      </div>
                    )}
                    
                    {booking.request_status.toLowerCase() === 'accepted' && hasReviewed(booking.id) && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">✓ Review submitted</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserBookings;