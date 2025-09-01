import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserSidebar from '@/components/UserSidebar';
import BookingForm from '@/components/BookingForm';
import ProviderProfile from '@/components/ProviderProfile';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserDashboard = () => {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userProfileUrl, setUserProfileUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingForm, setBookingForm] = useState<{
    isOpen: boolean;
    workerEmail: string;
    workerName: string;
    serviceType: string;
  }>({
    isOpen: false,
    workerEmail: '',
    workerName: '',
    serviceType: '',
  });
  const [providerProfile, setProviderProfile] = useState<{
    isOpen: boolean;
    providerId: number;
  }>({
    isOpen: false,
    providerId: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchWorkers();
  }, []);

  const fetchUserData = async () => {
    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) {
        navigate('/login');
        return;
      }

      const session = JSON.parse(userSession);
      const email = session.email;
      setUserEmail(email);

      if (email) {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, profile_url')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user data:', error);
        } else if (data) {
          setUserName(`${data.first_name} ${data.last_name}`);
          setUserProfileUrl(data.profile_url || '');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      // Fetch workers from existing workers table
      const { data: workers, error: workerError } = await supabase
        .from('workers')
        .select('*');

      if (workerError) {
        console.error('Error fetching workers:', workerError);
        setWorkers([]);
        return;
      }

      // Transform workers data to match expected format
      const transformedWorkers = workers?.map(worker => ({
        id: worker.worker_id,
        user_id: worker.worker_id,
        email: worker.email,
        designation: worker.designation,
        experience_years: worker.experience || 0,
        is_verified: true, // Default to true since the worker is in DB
        is_available: true, // Default to true
        rating: 4.5, // Default rating
        total_jobs: Math.floor(Math.random() * 50) + 10, // Random number for demo
        skills: worker.skills ? worker.skills.split(',').map(s => s.trim()) : [],
        working_hours: worker.preferred_working_hours,
        profile_url: worker.profile_url,
        profiles: {
          first_name: worker.first_name,
          last_name: worker.last_name,
          phone_number: worker.phone_number,
          city: worker.city
        }
      })) || [];

      setWorkers(transformedWorkers);
    } catch (err) {
      console.error('Error:', err);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'plumber', name: 'Plumber' },
    { id: 'electrician', name: 'Electrician' },
    { id: 'photographer', name: 'Photographer' },
    { id: 'videographer', name: 'Videographer' },
    { id: 'carpenter', name: 'Carpenter' },
    { id: 'cleaner', name: 'Cleaner' },
    { id: 'painter', name: 'Painter' },
    { id: 'decorator', name: 'Decorator' },
    { id: 'car-wash', name: 'Car Wash' },
    { id: 'water-tank-cleaner', name: 'Water Tank Cleaner' },
    { id: 'geyser-installer', name: 'Geyser Installer' },
    { id: 'cctv-installer', name: 'CCTV Installer' }
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesCategory = selectedCategory === 'all' || worker.designation === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      worker.profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getDesignationIcon = (designation: string) => {
    const icons: { [key: string]: string } = {
      plumber: '🔧',
      electrician: '⚡',
      photographer: '📸',
      videographer: '🎥',
      carpenter: '🔨',
      cleaner: '🧽',
      painter: '🎨',
      decorator: '🎭',
      'car-wash': '🚗',
      'water-tank-cleaner': '💧',
      'geyser-installer': '🔥',
      'cctv-installer': '📹'
    };
    return icons[designation] || '⚙️';
  };

  const handleBookService = (worker: any) => {
    setBookingForm({
      isOpen: true,
      workerEmail: worker.email,
      workerName: `${worker.profiles?.first_name} ${worker.profiles?.last_name}`,
      serviceType: worker.designation,
    });
  };

  const closeBookingForm = () => {
    setBookingForm({
      isOpen: false,
      workerEmail: '',
      workerName: '',
      serviceType: '',
    });
  };

  const handleViewProfile = (worker: any) => {
    setProviderProfile({
      isOpen: true,
      providerId: worker.id,
    });
  };

  const closeProviderProfile = () => {
    setProviderProfile({
      isOpen: false,
      providerId: 0,
    });
  };

  return (
    <UserSidebar>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8" data-aos="fade-up">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Find Service Providers
              </h1>
              <p className="text-muted-foreground hidden sm:block text-lg mt-2">
                Connect with verified professionals for all your service needs
              </p>
            </div>
            
            {/* Welcome Section - Top Right */}
            <div 
              className="card-elevated p-6 min-w-[280px]"
              data-aos="fade-left"
              data-aos-delay="200"
            >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-border flex-shrink-0 overflow-hidden bg-muted/20">
                  {userProfileUrl ? (
                    <img
                      src={userProfileUrl}
                      alt="Your profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-cta-primary/20 to-cta-primary/30 flex items-center justify-center text-xl ${userProfileUrl ? 'hidden' : ''}`}>
                    👤
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-foreground">
                    Welcome Back!
                  </h2>
                  <p className="text-cta-primary font-semibold text-lg">
                    {userName || 'User'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8" data-aos="fade-up" data-aos-delay="300">
          <Card className="card-elevated overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-card to-muted/30">
              <CardTitle className="text-2xl">Search Service Providers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-muted-foreground group-focus-within:text-cta-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for services, skills, or professionals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-input-border rounded-xl bg-input text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent transition-all duration-200 text-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 transform ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-cta-primary to-cta-primary-hover text-white shadow-lg'
                        : 'bg-muted text-foreground hover:bg-muted/80 hover:shadow-md'
                    }`}
                    data-aos="fade-up"
                    data-aos-delay={400 + index * 50}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta-primary mx-auto"></div>
              <span className="ml-3 text-muted-foreground text-lg mt-4 block">Loading service providers...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="500">
            {filteredWorkers.length === 0 ? (
              <Card className="col-span-full card-elevated">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.073M6.343 6.343A8 8 0 1021.314 8.686" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-lg">No service providers found for this category.</p>
                </CardContent>
              </Card>
            ) : (
              filteredWorkers.map((worker, index) => (
                <Card 
                  key={worker.id} 
                  className="card-feature group hover:scale-105 transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-200 border-2 border-border bg-muted/20 flex-shrink-0">
                        {worker.profile_url ? (
                          <img
                            src={worker.profile_url}
                            alt={`${worker.profiles?.first_name} ${worker.profiles?.last_name}`}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-gradient-to-br from-cta-primary/20 to-cta-primary/30 flex items-center justify-center text-3xl ${worker.profile_url ? 'hidden' : ''}`}>
                          {getDesignationIcon(worker.designation)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-cta-primary transition-colors duration-200">
                          {worker.profiles?.first_name} {worker.profiles?.last_name}
                        </CardTitle>
                        <p className="text-muted-foreground capitalize font-medium">
                          {worker.designation}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full ${
                          worker.is_available ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                        }`}></span>
                        <span className="ml-2 text-sm text-muted-foreground font-medium">
                          {worker.is_available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground block">Experience</span>
                        <p className="font-bold text-lg text-foreground">{worker.experience_years} years</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground block">Rating</span>
                        <p className="font-bold text-lg text-foreground">⭐ {worker.rating}/5</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground block">Location</span>
                        <p className="font-medium text-foreground">{worker.profiles?.city || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground block">Hours</span>
                        <p className="font-medium text-xs text-foreground">{worker.working_hours}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-3 font-medium">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {worker.skills?.slice(0, 3).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-muted to-muted/80 text-xs rounded-full font-medium border border-border"
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills?.length > 3 && (
                          <span className="px-3 py-1 bg-cta-primary/10 text-cta-primary text-xs rounded-full font-medium">
                            +{worker.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => handleBookService(worker)}
                        className="w-full btn-primary py-3 text-sm hover-glow"
                      >
                        Book Service
                      </button>
                      <button 
                        onClick={() => handleViewProfile(worker)}
                        className="w-full btn-ghost py-3 text-sm"
                      >
                        View Profile
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <BookingForm
        isOpen={bookingForm.isOpen}
        onClose={closeBookingForm}
        workerEmail={bookingForm.workerEmail}
        workerName={bookingForm.workerName}
        serviceType={bookingForm.serviceType}
      />

      <ProviderProfile
        isOpen={providerProfile.isOpen}
        onClose={closeProviderProfile}
        providerId={providerProfile.providerId}
      />
    </UserSidebar>
  );
};

export default UserDashboard;