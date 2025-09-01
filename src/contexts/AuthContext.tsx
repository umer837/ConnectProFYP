import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  adminSignIn: (email: string, password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  const adminSignIn = async (email: string, password: string) => {
    try {
      // Check admin table for admin credentials
      const { data: adminData }: { data: any } = await (supabase as any)
        .from('admin')
        .select('id, email, password')
        .eq('email', email)
        .maybeSingle();

      if (adminData) {
  if (password === adminData.password) {
    const sessionUser = {
      id: adminData.id,
      email: adminData.email,
      user_metadata: { 
        user_type: 'admin', 
        first_name: 'Admin', 
        last_name: 'User' 
      }
    };
          
          localStorage.setItem('admin_session', JSON.stringify(sessionUser));
          toast({
            title: "Admin Login Successful",
            description: "Welcome to ConnectPro Admin Dashboard",
          });
          return { error: null };
        }
      }

      // Check users table for regular users
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!userError && user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          const sessionUser = {
            id: user.id,
            email: user.email,
            user_metadata: { 
              user_type: 'user', 
              first_name: user.first_name, 
              last_name: user.last_name 
            }
          };
          
          localStorage.setItem('user_session', JSON.stringify(sessionUser));
          toast({
            title: "Login Successful",
            description: "Welcome to ConnectPro!",
          });
          return { error: null };
        }
      }

      // Check workers table for workers
      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('email', email)
        .single();

      if (!workerError && worker) {
        const isValidPassword = await bcrypt.compare(password, worker.password);
        if (isValidPassword) {
          // Check if worker is approved
          if (!(worker as any).is_approved) {
            toast({
              title: "Account Pending Approval",
              description: "Your worker account is not yet approved. Please wait for admin approval.",
              variant: "destructive"
            });
            return { error: { message: 'Account not approved' } };
          }

          const sessionUser = {
            id: worker.worker_id,
            email: worker.email,
            user_metadata: { 
              user_type: 'worker', 
              first_name: worker.first_name, 
              last_name: worker.last_name,
              designation: worker.designation
            }
          };
          
          localStorage.setItem('user_session', JSON.stringify(sessionUser));
          toast({
            title: "Login Successful",
            description: "Welcome to ConnectPro Worker Dashboard!",
          });
          return { error: null };
        }
      }

      // If no match found
      toast({
        title: "Login Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return { error: new Error('Invalid credentials') };
    } catch (err) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return { error: err };
    }
  };

  const signOut = async () => {
    // Clear all sessions
    localStorage.removeItem('admin_session');
    localStorage.removeItem('user_session');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    adminSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};