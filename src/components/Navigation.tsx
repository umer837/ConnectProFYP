import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: 'Home', path: '/', id: 'homeNav' },
    { name: 'About Us', path: '/about', id: 'aboutNav' },
    { name: 'Services', path: '/services', id: 'servicesNav' },
    { name: 'Contact Us', path: '/contact', id: 'contactNav' },
  ];

  return (
    <nav className="bg-nav-bg/95 backdrop-blur-lg text-nav-text fixed top-0 z-50 shadow-lg border-b border-white/10 w-full" id="mainNavigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200" 
              id="logoLink"
            >
              ConnectPro
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  id={item.id}
                  className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'hover:bg-white/10 text-nav-text/90 hover:text-white'
                  }`}
                >
                  {item.name}
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-cta-primary transform origin-left transition-transform duration-200 ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </Link>
              ))}
              <Link
                to="/login"
                id="loginNav"
                className="ml-4 px-4 py-1.5 bg-gradient-to-r from-cta-primary to-cta-primary-hover text-white rounded-md text-sm font-medium hover:shadow-md hover:scale-105 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                to="/admin/login"
                id="adminNav"
                className="px-3 py-1.5 border border-white/30 rounded-md text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-200 text-nav-text/90 hover:text-white"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-transparent inline-flex items-center justify-center p-2 rounded-lg text-nav-text hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 transition-all duration-200"
              id="mobileMenuBtn"
              onClick={() => {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden');
                  mobileMenu.classList.toggle('animate-slide-in-right');
                }
              }}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden hidden bg-nav-bg/95 backdrop-blur-lg border-t border-white/10" id="mobileMenu">
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'hover:bg-white/10 text-nav-text/90 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="block px-3 py-2 bg-gradient-to-r from-cta-primary to-cta-primary-hover text-white rounded-md text-sm font-medium hover:shadow-md transition-all duration-200 mt-3"
          >
            Log In
          </Link>
          <Link
            to="/admin/login"
            className="block px-3 py-2 border border-white/30 rounded-md text-sm font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-200 text-nav-text/90 hover:text-white"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;