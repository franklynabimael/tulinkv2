"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { signUp, login, logout, resetPassword } from '@/lib/auth/auth';
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
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  isTrialActive: boolean;
  trialDaysRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('[AuthContext] Error fetching profile:', profileError);
    }
    
    return profile ?? null;
  }, []);

  // Function to handle auth state
  const handleAuthState = useCallback(async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      setProfile(profile);
    } else {
      setProfile(null);
    }

    setLoading(false);
  }, [fetchProfile]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = createClient();
        
        // First, get current session
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthState(session);

        // Then subscribe to auth changes for future updates
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('[AuthContext] Auth state changed:', _event, session?.user?.email);
          handleAuthState(session);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [handleAuthState]);

  // Sign up handler
  const handleSignUp = useCallback(async (data: SignUpData): Promise<{ error: AuthError | null }> => {
    const { user, error, profileError } = await signUp(data);
    if (user) {
      // Don't manually set user - let the onAuthStateChange handle it
      console.log('Sign up successful, waiting for auth state change...');
    }
    // Return profileError as the main error if it exists
    return { error: error ?? profileError ?? null };
  }, []);

  // Login handler
  const handleLogin = useCallback(async (data: LoginData): Promise<{ error: AuthError | null }> => {
    const { user, error } = await login(data);
    if (user) {
      // Don't manually set user - let the onAuthStateChange handle it
      console.log('Login successful, waiting for auth state change...');
    }
    return { error };
  }, []);

  // Logout handler - redirect immediately after clearing state
  const handleLogout = useCallback(async (): Promise<void> => {
    // Clear state first
    setUser(null);
    setSession(null);
    setProfile(null);

    try {
      await logout();
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error);
    } finally {
      // Always redirect to login regardless of signOut result
      window.location.href = '/login';
    }
  }, []);

  // Reset password handler
  const handleResetPassword = useCallback(async (email: string): Promise<{ error: AuthError | null }> => {
    return await resetPassword(email);
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
    resetPassword: handleResetPassword,
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
