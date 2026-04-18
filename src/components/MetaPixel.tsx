import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TRACKING_ID } from '../lib/analytics';

export const MetaPixel = () => {
  const location = useLocation();

  useEffect(() => {
    if (!TRACKING_ID) return;

    if (!document.getElementById('meta-pixel')) {
      const script = document.createElement('script');
      script.id = 'meta-pixel';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${TRACKING_ID}');
      `;
      document.head.appendChild(script);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (TRACKING_ID && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
};
