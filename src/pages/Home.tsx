import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat hero-pattern"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${heroImage})` 
        }}
        id="heroSection"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full opacity-10">
            <div className="w-96 h-96 bg-cta-primary rounded-full animate-float"></div>
          </div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-10">
            <div className="w-80 h-80 bg-info rounded-full animate-float" style={{animationDelay: '3s'}}></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div 
              className="glass-card p-6 md:p-8 rounded-xl shadow-xl"
              data-aos="fade-up"
              data-aos-duration="1000"
              id="heroOverlay"
            >
              <h1 
                className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                data-aos="fade-up"
                data-aos-delay="200"
                id="heroTitle"
              >
                HOME SERVICES
              </h1>
              <h2 
                className="text-lg md:text-xl text-gray-200 mb-6 font-light"
                data-aos="fade-up"
                data-aos-delay="400"
                id="heroSubtitle"
              >
                Professional Services at Your Fingertips
              </h2>
              <p 
                className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="600"
                id="heroDescription"
              >
                Connect with verified professionals for all your home service needs. 
                From cleaning and maintenance to repairs and installations, we make it easy 
                to find trusted experts in your area.
              </p>
              <div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <Link
                  to="/services"
                  className="btn-primary hover-glow text-sm px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                  id="discoverMoreBtn"
                >
                  Discover More
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost text-white border-white/30 hover:bg-white/10 text-sm px-6 py-3 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce text-white/70">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-br from-background via-muted/30 to-background relative" id="featuresSection">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Why Choose ConnectPro?
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We make finding and booking home services simple, secure, and reliable with our innovative platform.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cta-primary to-cta-primary-hover mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div 
              className="text-center group"
              data-aos="fade-up"
              data-aos-delay="100"
              id="feature1"
            >
              <div className="card-feature group-hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cta-primary/20 to-cta-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-6 h-6 text-cta-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Verified Professionals</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  All service providers are thoroughly vetted and verified for your peace of mind and security.
                </p>
              </div>
            </div>
            
            <div 
              className="text-center group"
              data-aos="fade-up"
              data-aos-delay="200"
              id="feature2"
            >
              <div className="card-feature group-hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-info/20 to-info/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Easy Booking</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Book services quickly and easily through our intuitive platform with real-time availability.
                </p>
              </div>
            </div>
            
            <div 
              className="text-center group"
              data-aos="fade-up"
              data-aos-delay="300"
              id="feature3"
            >
              <div className="card-feature group-hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v2m0 16v2m10-10h-2M4 12H2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">24/7 Support</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Our dedicated customer support team is always ready to help you when you need assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="400">
            <div className="text-center">
              <div className="text-2xl font-bold text-cta-primary mb-1">1000+</div>
              <div className="text-muted-foreground text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cta-primary mb-1">500+</div>
              <div className="text-muted-foreground text-sm">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cta-primary mb-1">5000+</div>
              <div className="text-muted-foreground text-sm">Services Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cta-primary mb-1">4.9/5</div>
              <div className="text-muted-foreground text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-gradient-to-r from-cta-primary via-cta-primary-hover to-cta-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            data-aos="fade-up"
          >
            Ready to Get Started?
          </h2>
          <p 
            className="text-base text-white/90 mb-6 max-w-xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join thousands of satisfied customers who trust ConnectPro for their home service needs.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-3 justify-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link
              to="/register/user"
              className="bg-white text-cta-primary px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Sign Up as User
            </Link>
            <Link
              to="/register/worker"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-white hover:text-cta-primary transform hover:scale-105 transition-all duration-300"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;