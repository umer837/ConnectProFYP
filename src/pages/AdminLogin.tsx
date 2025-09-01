import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminSignIn } = useAuth();

  // Check if already logged in as admin
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check admin credentials using AuthContext
    const { error } = await adminSignIn(email, password);
    
    if (!error) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-admin-sidebar flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-background p-8 rounded-lg shadow-lg" id="adminLoginCard">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground" id="adminLoginTitle">
              Admin Login
            </h2>
            <p className="mt-2 text-muted-foreground">
              Access ConnectPro Admin Dashboard
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" id="adminLoginForm" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="adminEmailInput" className="block text-sm font-medium text-foreground mb-2">
                Admin Email
              </label>
              <input
                id="adminEmailInput"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label htmlFor="adminPasswordInput" className="block text-sm font-medium text-foreground mb-2">
                Admin Password
              </label>
              <input
                id="adminPasswordInput"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              id="adminLoginBtn"
              disabled={loading}
              className="w-full bg-cta-primary text-cta-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-cta-primary-hover focus:outline-none focus:ring-2 focus:ring-cta-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In as Admin'}
            </button>
          </form>


          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-cta-primary hover:text-cta-primary-hover text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;