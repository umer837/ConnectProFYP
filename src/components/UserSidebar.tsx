import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserSidebar = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('user_session');
    
    // Show success message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to home page
    navigate('/');
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/user/dashboard', id: 'userDashboardNav' },
    { name: 'My Bookings', path: '/user/bookings', id: 'userBookingsNav' },
    { name: 'Profile', path: '/user/profile', id: 'userProfileNav' },
    { name: 'Messages', path: '/user/messages', id: 'userMessagesNav' },
  ];

  if (children) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 w-64 h-screen bg-admin-sidebar border-r border-admin-sidebar-foreground/20 z-30">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-admin-sidebar-foreground/20">
              <Link to="/" className="text-admin-sidebar-foreground font-bold text-xl" id="userLogoLink">
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
                      className={`sidebar-item block px-4 py-3 text-sm font-medium transition-all duration-200 ${
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
                id="userLogoutBtn"
                className="block w-full px-4 py-3 text-center bg-admin-sidebar-foreground/10 hover:bg-admin-sidebar-foreground/20 rounded-lg text-sm font-medium text-admin-sidebar-foreground transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content with left margin for fixed sidebar */}
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    );
  }

  // Original sidebar for backward compatibility
  return (
    <div className="bg-admin-sidebar border-r border-admin-sidebar-foreground/20 h-full min-h-screen w-64 flex flex-col" id="userSidebar">
      {/* Logo */}
      <div className="p-4 border-b border-admin-sidebar-foreground/20">
        <Link to="/" className="text-xl font-bold text-admin-sidebar-foreground" id="userLogoLink">
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
                          className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive(item.path)
                              ? 'bg-admin-sidebar-accent text-admin-sidebar-accent-foreground'
                              : 'text-admin-sidebar-foreground hover:bg-admin-sidebar-foreground/10 hover:translate-x-1'
                          }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-admin-sidebar-foreground/20">
        <button
          onClick={handleLogout}
          id="userLogoutBtn"
          className="block w-full px-4 py-3 text-center bg-admin-sidebar-foreground/10 hover:bg-admin-sidebar-foreground/20 rounded-lg text-sm font-medium text-admin-sidebar-foreground transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;