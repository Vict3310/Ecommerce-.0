import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'NGN';
  });

  const rates = {
    USD: 1,
    NGN: 1550, // Example exchange rate
  };

  const symbols = {
    USD: '$',
    NGN: '₦',
  };

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'USD' ? 'NGN' : 'USD'));
  };

  const formatPrice = (price) => {
    const convertedPrice = price * rates[currency];
    return `${symbols[currency]}${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
