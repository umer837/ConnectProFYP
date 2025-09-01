import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkerSidebar from '@/components/WorkerSidebar';

interface Feedback {
  id: number;
  name: string;
  email: string;
  rating: number;
  message: string;
  service_request_id: number;
  submitted_at: string;
}

const WorkerFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) {
        navigate('/login');
        return;
      }

      const session = JSON.parse(userSession);
      const workerEmail = session.email;

      if (!workerEmail) return;

      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('worker_email', workerEmail)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedbacks:', error);
      } else {
        setFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  if (loading) {
    return (
      <WorkerSidebar>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading feedbacks...</p>
          </div>
        </div>
      </WorkerSidebar>
    );
  }

  return (
    <WorkerSidebar>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-lg sm:text-xl">Customer Feedbacks</span>
                <div className="text-sm text-muted-foreground">
                  Average Rating: {getAverageRating()} / 5.0
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">{feedbacks.length}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Reviews</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">{getAverageRating()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">
                    {feedbacks.filter(f => f.rating >= 4).length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">4+ Star Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {feedbacks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-muted-foreground">No feedback received yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Customer feedbacks will appear here after job completion
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{feedback.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{feedback.email}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="flex items-center justify-start sm:justify-end">
                          {renderStars(feedback.rating)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(feedback.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-foreground text-sm sm:text-base">{feedback.message}</p>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Service Request ID: {feedback.service_request_id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </WorkerSidebar>
  );
};

export default WorkerFeedbacks;