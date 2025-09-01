import { Link } from 'react-router-dom';
import decorationService from '@/assets/decoration-service.jpg';
import carWashService from '@/assets/car-wash-service.jpg';
import waterTankService from '@/assets/water-tank-cleaning-service.jpg';
import geyserService from '@/assets/geyser-installation-service.jpg';
import cctvService from '@/assets/cctv-installation-service.jpg';
import photography from '@/assets/photography.jpeg';
import videography from '@/assets/videography.jpg';
import plumbing from '@/assets/plumbing.jpg';
import carpentry from '@/assets/carpentry.jpg';
import cleaning from '@/assets/cleaning.jpg';
import painting from '@/assets/painting.jpg';
import electrician from '@/assets/electrical.jpg';

const services = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Professional photography services for events, portraits, and commercial needs.',
    icon: '',
    image: photography,
    features: ['Event Photography', 'Portrait Sessions', 'Product Photography', 'Wedding Photography']
  },
  {
    id: 'videography',
    title: 'Videography',
    description: 'High-quality video production and editing services for all occasions.',
    icon: '',
    image: videography,
    features: ['Event Videography', 'Corporate Videos', 'Wedding Films', 'Promotional Videos']
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    description: 'Expert plumbing services for repairs, installations, and maintenance.',
    icon: '',
    image: plumbing,
    features: ['Pipe Repairs', 'Fixture Installation', 'Drain Cleaning', 'Emergency Services']
  },
  {
    id: 'electrical',
    title: 'Electrician Services',
    description: 'Licensed electricians for all your electrical needs and safety requirements.',
    icon: '',
    image: electrician,
    features: ['Wiring Installation', 'Electrical Repairs', 'Panel Upgrades', 'Safety Inspections']
  },
  {
    id: 'carpentry',
    title: 'Carpentry',
    description: 'Skilled carpenters for custom woodwork, furniture, and home improvements.',
    icon: '',
    image: carpentry,
    features: ['Custom Furniture', 'Cabinet Installation', 'Door & Window Repairs', 'Deck Building']
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    description: 'Professional cleaning services for homes and commercial spaces.',
    icon: '',
    image: cleaning,
    features: ['House Cleaning', 'Deep Cleaning', 'Office Cleaning', 'Post-Construction Cleanup']
  },
  {
    id: 'painting',
    title: 'Painting',
    description: 'Expert painting services for interior and exterior spaces.',
    icon: '',
    image: painting,
    features: ['Interior Painting', 'Exterior Painting', 'Color Consultation', 'Wallpaper Installation']
  },
  {
    id: 'decoration',
    title: 'Decoration',
    description: 'Professional decoration services for events, parties, and special occasions.',
    icon: '',
    image: decorationService,
    features: ['Event Decoration', 'Birthday Parties', 'Wedding Decoration', 'Corporate Events']
  },
  {
    id: 'car-wash',
    title: 'Car Wash',
    description: 'Professional car washing and detailing services at your doorstep.',
    icon: '',
    image: carWashService,
    features: ['Exterior Wash', 'Interior Cleaning', 'Wax & Polish', 'Detailing Services']
  },
  {
    id: 'water-tank-cleaning',
    title: 'Water Tank Cleaning',
    description: 'Professional water tank cleaning and maintenance for clean water supply.',
    icon: '',
    image: waterTankService,
    features: ['Tank Cleaning', 'Disinfection', 'Maintenance', 'Quality Testing']
  },
  {
    id: 'geyser-installation',
    title: 'Geyser Installation',
    description: 'Expert geyser installation and repair services for hot water solutions.',
    icon: '',
    image: geyserService,
    features: ['New Installation', 'Repair Services', 'Maintenance', 'Energy Efficient Models']
  },
  {
    id: 'cctv-installation',
    title: 'CCTV Installation',
    description: 'Professional CCTV camera installation for security and surveillance.',
    icon: '',
    image: cctvService,
    features: ['Camera Installation', 'System Setup', 'Remote Monitoring', 'Maintenance Support']
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Professional home services delivered by verified experts. From photography to home maintenance, 
            we've got you covered.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                {/* Service Image */}
                {service.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-4">
                  {/* Service Icon & Title */}
                  <div className="flex items-center mb-3">
                    {/* <span className="text-2xl mr-2">{service.icon}</span> */}
                    <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 text-sm">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2 text-sm">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-cta-primary rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    to="/login"
                    className="block w-full text-center bg-cta-primary text-cta-primary-foreground py-2 px-3 rounded-md font-medium hover:bg-cta-primary-hover transition-colors duration-200 transform hover:scale-105 text-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Join thousands of satisfied customers who trust ConnectPro for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register/user"
              className="bg-cta-primary text-cta-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-cta-primary-hover transition-colors duration-200 text-sm"
            >
              Register as Customer
            </Link>
            <Link
              to="/register/worker"
              className="border border-cta-primary text-cta-primary px-6 py-2 rounded-md font-medium hover:bg-cta-primary hover:text-cta-primary-foreground transition-colors duration-200 text-sm"
            >
              Join as Service Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Service Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-base font-semibold text-foreground mb-2">Peshawar City</h3>
              <p className="text-muted-foreground text-sm">
                Complete coverage across all major areas of Peshawar including University Town, Hayatabad, and city center.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-base font-semibold text-foreground mb-2">Surrounding Areas</h3>
              <p className="text-muted-foreground text-sm">
                We also serve nearby areas and suburban locations around Peshawar with the same quality service.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="text-base font-semibold text-foreground mb-2">Expanding Coverage</h3>
              <p className="text-muted-foreground text-sm">
                Our service network is constantly growing. Contact us to check availability in your area.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
