"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { signUp, login, logout, getCurrentUser } from '@/lib/auth/auth';
import { SignUpData, LoginData, AuthError } from '@/lib/auth/auth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  trial_start_date: string;
  trial_end_date: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: AuthError | null }>;
  login: (data: LoginData) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  isTrialActive: boolean;
  trialDaysRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial session
  useEffect(() => {
    const loadSession = async () => {
      const { user, session, profile } = await getCurrentUser();
      setUser(user);
      setSession(session);
      setProfile(profile ?? null);
      setLoading(false);
    };

    loadSession();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(profile ?? null);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up handler
  const handleSignUp = useCallback(async (data: SignUpData): Promise<{ error: AuthError | null }> => {
    const { user, error } = await signUp(data);
    if (user) {
      setUser(user);
    }
    return { error };
  }, []);

  // Login handler
  const handleLogin = useCallback(async (data: LoginData): Promise<{ error: AuthError | null }> => {
    const { user, error } = await login(data);
    if (user) {
      setUser(user);
    }
    return { error };
  }, []);

  // Logout handler
  const handleLogout = useCallback(async (): Promise<void> => {
    await logout();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  // Calculate trial status
  const isTrialActive = profile ? new Date() < new Date(profile.trial_end_date) : false;
  const trialDaysRemaining = profile ? Math.max(0, Math.ceil(
    (new Date(profile.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )) : 0;

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp: handleSignUp,
    login: handleLogin,
    logout: handleLogout,
    isTrialActive,
    trialDaysRemaining,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
