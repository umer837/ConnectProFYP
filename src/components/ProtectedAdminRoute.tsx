import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminSession = localStorage.getItem('admin_session');
      
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          // Verify it's a valid admin session
          if (session.email === 'admin@connectpro.com' && session.user_metadata?.user_type === 'admin') {
            setIsAuthenticated(true);
          } else {
            // Invalid session, remove it
            localStorage.removeItem('admin_session');
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Corrupted session, remove it
          localStorage.removeItem('admin_session');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-admin-sidebar flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-sidebar-foreground mx-auto mb-4"></div>
          <p className="text-admin-sidebar-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This shouldn't render due to the redirect, but just in case
  return null;
};

export default ProtectedAdminRoute;