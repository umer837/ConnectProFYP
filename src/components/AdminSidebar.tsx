import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { DashboardIcon, FileTextIcon, CheckIcon, PersonIcon, ChatBubbleIcon, ExitIcon } from '@radix-ui/react-icons';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminSidebar = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from admin panel.",
    });
    navigate('/');
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', id: 'adminDashboardNav', icon: DashboardIcon },
    { name: 'Service Requests', path: '/admin/requests', id: 'adminRequestsNav', icon: FileTextIcon },
    { name: 'Approve Providers', path: '/admin/providers', id: 'adminProvidersNav', icon: CheckIcon },
    { name: 'Users', path: '/admin/users', id: 'adminUsersNav', icon: PersonIcon },
    { name: 'Contact Messages', path: '/admin/contacts', id: 'adminContactsNav', icon: ChatBubbleIcon },
  ];

  if (children) {
    return (
      <div className="flex min-h-screen w-full">
        {/* Fixed Sidebar */}
        <div className={`${
          isMobile ? (isCollapsed ? 'hidden' : 'fixed inset-y-0 left-0 z-50 w-64') : 
          isCollapsed ? 'fixed left-0 top-0 w-16 h-screen z-30' : 'fixed left-0 top-0 w-64 h-screen z-30'
        } bg-admin-sidebar text-admin-sidebar-foreground transition-all duration-300`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-admin-sidebar-foreground/20">
              <Link 
                to="/" 
                className="text-admin-sidebar-foreground font-bold flex items-center gap-2"
                id="adminLogoLink"
              >
                {!isCollapsed && "."}
                {isCollapsed && "CP"}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 pb-20 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    id={item.id}
                     className={`sidebar-item flex items-center gap-3 px-3 py-2 text-sm font-medium ${
                       isActive(item.path)
                         ? 'sidebar-item-active bg-cta-primary/20 border-r-2 border-cta-primary text-white'
                         : 'text-admin-sidebar-foreground hover:bg-admin-sidebar-foreground/15 hover:translate-x-1'
                     }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Fixed Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-admin-sidebar-foreground/20 bg-admin-sidebar">
              <button
                onClick={handleLogout}
                id="adminLogoutBtn"
                className="flex items-center gap-3 w-full px-3 py-2 text-admin-sidebar-foreground bg-admin-sidebar-foreground/10 rounded-lg text-sm font-medium hover:bg-admin-sidebar-foreground/20 hover:scale-105 transition-smooth"
              >
                <ExitIcon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {isMobile && !isCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCollapsed(true)}
          />
        )}

        {/* Main content with left margin for fixed sidebar */}
        <div className={`flex-1 flex flex-col ${
          isMobile ? 'ml-0' : isCollapsed ? 'ml-16' : 'ml-64'
        } transition-all duration-300`}>
          {/* Mobile header */}
          <header className="h-12 flex items-center border-b border-border bg-background px-4 lg:hidden">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md text-foreground hover:bg-muted"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          {/* Desktop toggle button */}
          <div className="hidden lg:block fixed top-4 left-4 z-40">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md bg-background border border-border text-foreground hover:bg-muted"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Original sidebar for backward compatibility
  return (
    <div className="bg-admin-sidebar text-admin-sidebar-foreground h-full min-h-screen w-64 flex flex-col" id="adminSidebar">
      <div className="p-6 border-b border-admin-sidebar-foreground/20">
        <Link to="/" className="text-xl font-bold" id="adminLogoLink">
          ConnectPro Admin
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                id={item.id}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-admin-sidebar-active text-white'
                    : 'hover:bg-admin-sidebar-foreground/10'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-admin-sidebar-foreground/20">
        <button
          onClick={handleLogout}
          id="adminLogoutBtn"
          className="block w-full px-4 py-3 text-center bg-admin-sidebar-foreground/10 rounded-lg text-sm font-medium hover:bg-admin-sidebar-foreground/20 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;