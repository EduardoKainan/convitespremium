import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Invitation from '../components/Invitation';
import { InvitationData } from '../types';
import LZString from 'lz-string';

export default function InviteView() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<InvitationData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const encodedData = searchParams.get('d');
    if (encodedData) {
      try {
        // First try to decode with LZString (new format)
        let decodedString = LZString.decompressFromEncodedURIComponent(encodedData);
        
        // Fallback for old base64 format if LZString fails
        if (!decodedString) {
          decodedString = decodeURIComponent(atob(encodedData));
        }

        if (decodedString) {
          const decodedData = JSON.parse(decodedString);
          setData(decodedData);

          // Update Open Graph tags dynamically
          document.title = `Convite de ${decodedData.title} - ${decodedData.name}`;
            
          const setMeta = (name: string, property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
              meta = document.createElement('meta');
              meta.setAttribute('property', property);
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
          };

          setMeta('og:title', 'og:title', `Convite: ${decodedData.title} de ${decodedData.name}`);
          setMeta('og:description', 'og:description', `Você foi convidado! Data: ${decodedData.date.split('-').reverse().join('/')} às ${decodedData.time}. Toque para abrir o convite interativo.`);
          if (decodedData.images?.cover) {
            setMeta('og:image', 'og:image', decodedData.images.cover);
          }

        } else {
          throw new Error("Failed to decompress");
        }
      } catch (e) {
        console.error("Invalid invitation data", e);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Convite não encontrado</h1>
        <p className="text-gray-400">O link que você acessou é inválido ou está quebrado.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Carregando convite...</div>
      </div>
    );
  }

  return <Invitation data={data} />;
}
