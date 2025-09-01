import { useEffect } from 'react';
import AOS from 'aos';

const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
      delay: 0,
    });

    // Refresh AOS on route changes
    return () => {
      AOS.refresh();
    };
  }, []);

  return null;
};

export default AOSInit;