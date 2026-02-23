'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from './supabase/client';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'staff' | 'customer';
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [client] = useState(() => createClient());

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        const isNoRows = error.code === 'PGRST116';
        if (!isNoRows) {
          console.error('Profile fetch error:', error.message ?? error);
        }
        setProfile(null);
        return;
      }

      setProfile(data as Profile);
    } catch (err) {
      console.error('Fatal error fetching profile:', err);
      setProfile(null);
    }
  }, [client]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const { data: { user } } = await client.auth.getUser();
        if (!mounted) return;

        if (user) {
          setUser(user);
          fetchProfile(user.id); // run in background, don't block loading
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchProfile(currentUser.id); // run in background, don't block loading
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [client, fetchProfile]);

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    try {
      await Promise.race([
        client.auth.signOut(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Sign out timeout')), 5000)
        ),
      ]);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
