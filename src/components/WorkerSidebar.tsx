import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const WorkerSidebar = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/worker/dashboard', id: 'workerDashboardNav' },
    { name: 'Profile', path: '/worker/profile', id: 'workerProfileNav' },
    { name: 'Feedbacks', path: '/worker/feedbacks', id: 'workerFeedbacksNav' },
  ];

  if (children) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Fixed Sidebar - Desktop */}
        <div className={`${
          isMobile ? 'hidden' : 'fixed left-0 top-0 w-64 h-screen z-30'
        } bg-admin-sidebar text-admin-sidebar-foreground border-r border-admin-sidebar-foreground/20`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-admin-sidebar-foreground/20">
              <Link to="/" className="text-xl font-bold text-admin-sidebar-foreground" id="workerLogoLink">
                ConnectPro
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 pb-20 overflow-y-auto">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                     <Link
                      to={item.path}
                      id={item.id}
                      className={`sidebar-item block px-4 py-3 text-sm font-medium ${
                        isActive(item.path)
                          ? 'sidebar-item-active bg-cta-primary/20 border-r-2 border-cta-primary text-white'
                          : 'text-admin-sidebar-foreground hover:bg-admin-sidebar-foreground/15 hover:translate-x-1'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Fixed Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-admin-sidebar-foreground/20 bg-admin-sidebar">
              <button
                onClick={handleLogout}
                id="workerLogoutBtn"
                className="block w-full px-4 py-3 text-center bg-admin-sidebar-foreground/10 hover:bg-admin-sidebar-foreground/20 rounded-lg text-sm font-medium text-admin-sidebar-foreground transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed top-4 left-4 z-50 p-2 bg-admin-sidebar border border-admin-sidebar-foreground/20 rounded-lg shadow-lg lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-admin-sidebar-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-admin-sidebar-foreground" />
            )}
          </button>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden">
            <div className="fixed left-0 top-0 w-64 h-screen bg-admin-sidebar border-r border-admin-sidebar-foreground/20">
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-4 border-b border-admin-sidebar-foreground/20">
                  <Link 
                    to="/" 
                    className="text-xl font-bold text-admin-sidebar-foreground" 
                    id="workerLogoLinkMobile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ConnectPro
                  </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 pb-20 overflow-y-auto">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          id={`${item.id}Mobile`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-admin-sidebar-accent text-admin-sidebar-accent-foreground'
                              : 'text-admin-sidebar-foreground hover:bg-admin-sidebar-foreground/10'
                          }`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Fixed Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-admin-sidebar-foreground/20 bg-admin-sidebar">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    id="workerLogoutBtnMobile"
                    className="block w-full px-4 py-3 text-center bg-admin-sidebar-foreground/10 hover:bg-admin-sidebar-foreground/20 rounded-lg text-sm font-medium text-admin-sidebar-foreground transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content with left margin for fixed sidebar */}
        <div className={`flex-1 ${isMobile ? 'ml-0' : 'ml-64'}`}>
          {children}
        </div>
      </div>
    );
  }

  // Original sidebar for backward compatibility
  return (
    <div className="bg-card border-r border-border h-full min-h-screen w-64 flex flex-col" id="workerSidebar">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="text-xl font-bold text-card-foreground" id="workerLogoLink">
          ConnectPro
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                id={item.id}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-cta-primary text-cta-primary-foreground'
                    : 'text-card-foreground hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          id="workerLogoutBtn"
          className="block w-full px-4 py-3 text-center bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-card-foreground transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default WorkerSidebar;