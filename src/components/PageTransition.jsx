import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const transitionRef = useRef(null);

  useGSAP(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    gsap.fromTo(
      transitionRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div ref={transitionRef} style={{ width: '100%' }}>
      {children}
    </div>
  );
};

export default PageTransition;
