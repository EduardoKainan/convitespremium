import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templates } from '../data/templates';
import { InvitationData } from '../types';
import Invitation from '../components/Invitation';
import { ArrowLeft, Share2, Smartphone, Copy, Check } from 'lucide-react';

export default function Editor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InvitationData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setData(template.defaultData);
    } else {
      navigate('/');
    }
  }, [templateId, navigate]);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => prev ? {
      ...prev,
      theme: { ...prev.theme, [name]: value }
    } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => prev ? {
      ...prev,
      images: { ...prev.images, [name]: value }
    } : null);
  };

  const handleShare = () => {
    // Encode data to base64 to create a stateless shareable link
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const link = `${window.location.origin}/invite?d=${encoded}`;
    setShareLink(link);
    setShowModal(true);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Left Panel - Editor Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-white shadow-xl z-10 flex flex-col h-screen">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>
          <button onClick={handleShare} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Share2 size={16} className="mr-2" />
            Compartilhar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Editar Convite</h2>
            <p className="text-sm text-gray-500">Personalize as informações do seu evento.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações Principais</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Título (ex: Os 15 anos de)</label>
              <input type="text" name="title" value={data.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Anfitrião</label>
              <input type="text" name="name" value={data.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input type="date" name="date" value={data.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Horário</label>
                <input type="time" name="time" value={data.time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Local e Mensagem</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Local</label>
              <input type="text" name="locationName" value={data.locationName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço Completo</label>
              <input type="text" name="locationAddress" value={data.locationAddress} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Link do Google Maps</label>
              <input type="url" name="locationUrl" value={data.locationUrl} onChange={handleChange} placeholder="https://maps.google.com/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mensagem de Convite</label>
              <textarea name="message" value={data.message} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mensagem Final (Rodapé)</label>
              <textarea name="finalMessage" value={data.finalMessage} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dress Code (Traje)</label>
              <input type="text" name="dressCode" value={data.dressCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Links e Mídia</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Link de Confirmação (WhatsApp/RSVP)</label>
              <input type="url" name="rsvpLink" value={data.rsvpLink} onChange={handleChange} placeholder="https://wa.me/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">URL da Foto da Capa (Envelope)</label>
              <input type="text" name="cover" value={data.images.cover} onChange={handleImageChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL da Foto Principal (Interna)</label>
              <input type="text" name="hero" value={data.images.hero} onChange={handleImageChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL da Foto do Rodapé</label>
              <input type="text" name="footer" value={data.images.footer} onChange={handleImageChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL da Música (MP3)</label>
              <input type="text" name="musicUrl" value={data.musicUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cor Principal</label>
                <div className="flex items-center mt-1">
                  <input type="color" name="primary" value={data.theme.primary} onChange={handleThemeChange} className="h-8 w-8 border-0 rounded-md p-0" />
                  <span className="ml-2 text-xs text-gray-500">{data.theme.primary}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
                <div className="flex items-center mt-1">
                  <input type="color" name="background" value={data.theme.background} onChange={handleThemeChange} className="h-8 w-8 border-0 rounded-md p-0" />
                  <span className="ml-2 text-xs text-gray-500">{data.theme.background}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pb-10"></div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="hidden md:flex flex-1 bg-gray-200 items-center justify-center p-8 h-screen overflow-hidden relative">
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-sm flex items-center text-sm font-medium text-gray-600">
          <Smartphone size={16} className="mr-2" />
          Preview Mobile
        </div>
        
        {/* Mobile Mockup */}
        <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-gray-800 relative ring-1 ring-gray-900/5">
          {/* Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-3xl w-40 mx-auto z-50"></div>
          
          {/* Invitation Component */}
          <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
            <Invitation data={data} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Convite Pronto! 🎉</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Seu convite foi gerado com sucesso. Copie o link abaixo e envie para seus convidados.
            </p>
            
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="text" 
                readOnly 
                value={shareLink} 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={copyToClipboard}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition-colors flex items-center justify-center w-10 h-10 shrink-0"
                title="Copiar Link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
