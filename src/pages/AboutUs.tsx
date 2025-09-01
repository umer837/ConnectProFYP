import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About ConnectPro
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting you with professional home service providers across Peshawar and surrounding areas.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Company Info */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  ConnectPro was founded with a simple mission: to make finding reliable 
                  home service providers easy, fast, and trustworthy. Based in the heart 
                  of Peshawar, we understand the unique needs of our community.
                </p>
                <p>
                  Our platform connects homeowners with verified professionals across 
                  various service categories, from photography and videography to 
                  essential home maintenance services like plumbing, electrical work, 
                  and cleaning.
                </p>
                <p>
                  We believe in quality, reliability, and building lasting relationships 
                  between service providers and customers.
                </p>
              </div>

              <div className="mt-8 p-6 bg-card rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Base:</strong> Peshawar, Pakistan</p>
                  <p><strong>Office:</strong> Town Heights, University Town</p>
                  <p><strong>Phone:</strong> +92 312 94244445</p>
                </div>
                <Link 
                  to="/contact" 
                  className="inline-block mt-4 bg-cta-primary text-cta-primary-foreground px-6 py-2 rounded-lg hover:bg-cta-primary-hover transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Team Section */}
<div>
  <h2 className="text-3xl font-bold text-foreground mb-6">
    Our Team
  </h2>

  <div className="space-y-6">
    {/* Team Member 1 - Umar Farooq */}
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex items-center space-x-4">
        <img
          src="/umar.jpg"
          alt="Umar Farooq"
          className="w-16 h-16 rounded-full object-cover border border-muted"
        />
        <div>
          <h3 className="text-xl font-semibold text-foreground">Umar Farooq</h3>
          <p className="text-cta-primary font-medium">Project Lead</p>
          <p className="text-sm text-muted-foreground">imumar837@gmail.com</p>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground">
        Leading the development and vision of ConnectPro, ensuring 
        our platform meets the highest standards of quality and user experience.
      </p>
    </div>

    {/* Team Member 2 - Sir Salahuddin */}
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex items-center space-x-4">
        <img
          src="/salahuddin.jpg"
          alt="Sir Salahuddin"
          className="w-16 h-16 rounded-full object-cover border border-muted"
        />
        <div>
          <h3 className="text-xl font-semibold text-foreground">Sir Salauddin</h3>
          <p className="text-cta-primary font-medium">Supervisor</p>
          <p className="text-sm text-muted-foreground">salauddin@icp.edu.pk</p>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground">
        Providing strategic guidance and oversight to ensure ConnectPro 
        delivers exceptional value to both service providers and customers.
      </p>
    </div>
  </div>
</div>

          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to building a trustworthy platform that benefits everyone in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality First</h3>
              <p className="text-muted-foreground">
                Every service provider on our platform is thoroughly verified to ensure 
                you receive the highest quality of service.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">Community Focus</h3>
              <p className="text-muted-foreground">
                We're proud to serve the Peshawar community and support local 
                businesses and service providers.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">Trust & Transparency</h3>
              <p className="text-muted-foreground">
                We believe in honest communication, fair pricing, and building 
                lasting relationships based on trust.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;