import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-nav-bg/95 text-nav-text backdrop-blur-lg border-t border-white/10 shadow-inner" id="mainFooter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold mb-4 block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ConnectPro
            </Link>
            <p className="text-nav-text/80 mb-4 max-w-md">
              Professional home services at your fingertips. Connect with verified 
              service providers for all your home maintenance and repair needs.
            </p>
            <div className="space-y-2 text-sm text-nav-text/80">
              <p><strong>Base:</strong> Peshawar, Pakistan</p>
              <p><strong>Office:</strong> Town Heights, University Town</p>
              <p><strong>Contact:</strong> +92 312 94244445</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', to: '/' },
                { name: 'Services', to: '/services' },
                { name: 'About Us', to: '/about' },
                { name: 'Contact', to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-nav-text/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-nav-text/80">
              <li>Photography</li>
              <li>Videography</li>
              <li>Plumbing</li>
              <li>Electrical</li>
              <li>Carpentry</li>
              <li>Cleaning</li>
              <li>Painting</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-nav-text/60 text-sm">
            © 2024 ConnectPro. All rights reserved. | Providing professional home services in Peshawar and surrounding areas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
