import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Star, MapPin, Clock, Phone, Mail, Calendar, Award } from 'lucide-react';

interface ProviderProfileProps {
  providerId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProviderProfile = ({ providerId, isOpen, onClose }: ProviderProfileProps) => {
  const [provider, setProvider] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && providerId) {
      fetchProviderData();
      fetchProviderFeedbacks();
    }
  }, [isOpen, providerId]);

  const fetchProviderData = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('worker_id', providerId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching provider data:', error);
        return;
      }
      if (data) {
        setProvider(data);

        // --- Fetch profile image using same approach as WorkerDashboard ---
        if (data.profile_url) {
          // If bucket is public, you can get a public URL
          const { data: urlData } = supabase
            .storage
            .from('user_profiles') // your bucket name
            .getPublicUrl(data.profile_url);

          setProfileImageUrl(urlData.publicUrl);
        }
      }
    } catch (err) {
      console.error('Error fetching provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('worker_email', provider?.email)
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching feedbacks:', error);
      } else {
        setFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

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

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl border border-border shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Provider Profile</h2>
          <Button onClick={onClose} variant="ghost" size="sm" className="hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta-primary"></div>
          </div>
        ) : provider ? (
          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={`${provider.first_name} ${provider.last_name}`}
                        className="w-32 h-32 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-cta-primary/20 to-cta-primary/30 rounded-full flex items-center justify-center text-6xl mx-auto">
                        {getDesignationIcon(provider.designation)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-foreground">
                        {provider.first_name} {provider.last_name}
                      </h3>
                      <p className="text-cta-primary text-xl font-semibold capitalize">
                        {provider.designation}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={provider.is_available ? "default" : "secondary"} className="text-sm">
                          {provider.is_available ? 'Available' : 'Busy'}
                        </Badge>
                        <Badge variant={provider.is_approved ? "default" : "destructive"} className="text-sm">
                          {provider.is_approved ? 'Approved' : 'Pending Approval'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Rating: {averageRating.toFixed(1)}/5.0 ({feedbacks.length} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-cta-primary" />
                        <span>Experience: {provider.experience || 0} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.preferred_working_hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.phone_number}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.full_address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Age: {calculateAge(provider.date_of_birth)} years</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Expertise */}
            {provider.skills && (
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {provider.skills.split(',').map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Reviews */}
            {feedbacks.length > 0 && (
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedbacks.map((feedback, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{feedback.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(feedback.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{feedback.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Provider not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;
