import { useEffect, useState } from 'react';

type ScreenType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

export const useResponsive = () => {
  const [screenType, setScreenType] = useState<ScreenType>('desktop');

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      if (width <= 640) setScreenType('mobile');
      else if (width <= 768) setScreenType('tablet');
      else if (width <= 1280) setScreenType('laptop');
      else setScreenType('desktop');
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return {
    screenType,
    isMobile: screenType === 'mobile',
    isTablet: screenType === 'tablet',
    isLaptop: screenType === 'laptop',
    isDesktop: screenType === 'desktop',
  };
};
