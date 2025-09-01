import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminSignIn, user, session } = useAuth();
  const navigate = useNavigate();

  // Only redirect after successful login, not on page load
  useEffect(() => {
    // Only redirect if we just successfully logged in and there's a session
    if (user && session) {
      const userType = user.user_metadata?.user_type || 'user';
      if (userType === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [user, session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await adminSignIn(email, password);
      
      if (!error) {
        // Check which type of login was successful and redirect accordingly
        const adminSession = localStorage.getItem('admin_session');
        const userSession = localStorage.getItem('user_session');
        
        if (adminSession) {
          navigate('/admin/dashboard');
        } else if (userSession) {
          try {
            const session = JSON.parse(userSession);
            const userType = session.user_metadata?.user_type || 'user';
            if (userType === 'worker') {
              navigate('/worker/dashboard');
            } else {
              navigate('/user/dashboard');
            }
          } catch (error) {
            console.error('Error parsing user session:', error);
            localStorage.removeItem('user_session');
            navigate('/user/dashboard'); // fallback
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted/50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-sm w-full space-y-6">
        <div 
          className="card-elevated p-6"
          data-aos="fade-up"
          data-aos-duration="600"
          id="loginCard"
        >
          {/* Header */}
          <div className="text-center mb-6" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent" id="loginTitle">
              Welcome Back
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Sign in to your ConnectPro account
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cta-primary to-cta-primary-hover mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Login Form */}
          <form className="space-y-4" id="loginForm" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="400">
            <div className="space-y-4">
              <div>
                <label htmlFor="emailInput" className="block text-xs font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="emailInput"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="passwordInput" className="block text-xs font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  id="passwordInput"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-cta-primary focus:ring-cta-primary border-input-border rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="story-link text-cta-primary hover:text-cta-primary-hover">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              id="loginBtn"
              disabled={loading}
              className="w-full btn-primary hover-glow text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="mt-6 space-y-3" data-aos="fade-up" data-aos-delay="600">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground font-medium">
                  New to ConnectPro?
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/register/user"
                id="registerUserLink"
                className="btn-ghost text-center hover:border-cta-primary/30 hover:text-cta-primary group text-sm py-2"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Register as User
                </div>
              </Link>
              
              <Link
                to="/register/worker"
                id="registerWorkerLink"
                className="btn-ghost text-center hover:border-cta-primary/30 hover:text-cta-primary group text-sm py-2"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                  </svg>
                  Join as Provider
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;