import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

export const WhatsAppButton = () => {
  const location = useLocation();
  
  // Do not show the WhatsApp button on the actual invitation view pages
  const hideOnRoutes = ['/invite', '/c/'];
  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) return null;

  // Substitua por seu número de WhatsApp real (com DDI e DDD, ex: 5511999999999)
  const phoneNumber = "556282042056"; 
  const message = "Olá! Gostaria de encomendar um convite personalizado da Lumière Invites. Pode me ajudar?";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackEvent('Contact', { method: 'whatsapp', purpose: 'encomendar_convite' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-transform duration-300 transform translate-y-0 group">
      {/* Tooltip that shows on hover */}
      <div className="bg-white text-gray-800 text-sm font-medium py-2 px-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute right-16 whitespace-nowrap border border-gray-100 hidden sm:block">
        Fale com um atendente
      </div>
      
      {/* Main button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] text-white rounded-full shadow-xl hover:bg-[#20b858] hover:scale-110 transition-all duration-300 relative"
        aria-label="Falar no WhatsApp"
      >
        {/* Background ping animation */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25"></div>
        
        {/* WhatsApp Icon */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 relative z-10">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825.001 6.938 3.113 6.939 6.938-.001 3.825-3.114 6.938-6.939 6.942z"/>
        </svg>
      </a>
    </div>
  );
};
