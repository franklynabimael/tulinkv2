import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 * Creates user in Supabase Auth and creates a profile with 30-day trial
 */
export async function signUp({ name, email, password }: SignUpData): Promise<{ user: User | null; error: AuthError | null; profileError?: AuthError | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    // Create profile with 30-day trial
    if (data.user) {
      const trialStartDate = new Date().toISOString();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      const trialEndDateISO = trialEndDate.toISOString();

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          trial_start_date: trialStartDate,
          trial_end_date: trialEndDateISO,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return {
          user: data.user,
          error: null,
          profileError: { message: `Cuenta creada pero hubo un error al crear tu perfil: ${profileError.message}` },
        };
      }
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado al registrarse';
    console.error('[signUp] Error:', err);
    return { user: null, error: { message } };
  }
}

/**
 * Log in an existing user
 */
export async function login({ email, password }: LoginData): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
    console.error('[login] Error:', err);
    return { user: null, error: { message } };
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<{ error: AuthError | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[logout] Error:', error);
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado al cerrar sesión';
    console.error('[logout] Error:', err);
    return { error: { message } };
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { user: null, session: null, profile: null };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('[getCurrentUser] Error fetching profile:', profileError);
    }

    return { user: session.user, session, profile };
  } catch (err: unknown) {
    console.error('[getCurrentUser] Error:', err);
    return { user: null, session: null, profile: null };
  }
}

/**
 * Request a password reset email
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('[resetPassword] Error:', error);
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado al solicitar restablecimiento';
    console.error('[resetPassword] Error:', err);
    return { error: { message } };
  }
}

/**
 * Check if user's trial is still active
 */
export function isTrialActive(trialEndDate: string): boolean {
  const now = new Date();
  const trialEnd = new Date(trialEndDate);
  return now < trialEnd;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(trialEndDate: string): number {
  const now = new Date();
  const trialEnd = new Date(trialEndDate);
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
