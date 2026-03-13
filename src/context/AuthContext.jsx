import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
      }
      // If we don't have a profile yet (just signed up), the trigger might not have fired 
      // or we might need to handle it differently, but for now we set what we get.
      setProfile(data || null);
    } catch (err) {
      console.error("Error in fetchProfile:", err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  };


  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const signInWithGithub = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
  };
  
  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, profile, isAdmin, signUp, signIn, signOut, 
      signInWithGoogle, signInWithGithub, loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
