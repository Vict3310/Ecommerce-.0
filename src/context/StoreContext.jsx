import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState({
    store_name: 'Exclusive Ikeja',
    hero_headline: 'Lagos\'s Premier Shopping Destination',
    hero_subheadline: 'Exclusive Deals Now at Ikeja City Mall & Online',
    contact_email: 'support@exclusive-ikeja.com',
    currency_symbol: '₦',
    banner_message: 'Free Express Delivery Within Ikeja - Flash Sale Today!',
    hero_images: [],
    promo_banner: {
      title: "Enhance Your Music Experience",
      category: "category",
      image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      button_text: "Buy Now",
      countdown_date: null
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    
    // Optional: Realtime subscription to store_settings
    // This allows the frontend to update instantly when the admin changes settings
    const channel = supabase
      .channel('public:store_settings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'store_settings' }, (payload) => {
         setStoreSettings(prev => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (data) {
        setStoreSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Error fetching store settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreContext.Provider value={{ storeSettings, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreSettings = () => {
  return useContext(StoreContext);
};
