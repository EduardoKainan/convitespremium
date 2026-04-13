import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templates } from '../data/templates';
import { InvitationData } from '../types';
import Invitation from '../components/Invitation';
import { ArrowLeft, Share2, Smartphone, Copy, Check, Link as LinkIcon, LogIn, Loader2, Save } from 'lucide-react';
import LZString from 'lz-string';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function Editor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InvitationData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Firebase Auth & Custom Link States
  const [user, setUser] = useState<User | null>(null);
  const [customPath, setCustomPath] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    // Compress and encode data to create a stateless shareable link
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(data));
    const link = `${window.location.origin}/invite?d=${compressed}`;
    setShareLink(link);
    setShowModal(true);
    setCopied(false);
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSaveCustomLink = async () => {
    if (!user) return;
    if (!customPath.trim()) {
      setSaveError("Digite um nome para o link.");
      return;
    }

    // Format path: lowercase, replace spaces with hyphens, remove special chars
    const formattedPath = customPath
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (formattedPath.length < 3) {
      setSaveError("O link deve ter pelo menos 3 caracteres.");
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const docRef = doc(db, 'invitations', formattedPath);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().ownerUid !== user.uid) {
        setSaveError("Este link já está em uso por outra pessoa. Escolha outro.");
        setIsSaving(false);
        return;
      }

      await setDoc(docRef, {
        id: formattedPath,
        ownerUid: user.uid,
        data: data,
        createdAt: serverTimestamp()
      });

      const newLink = `${window.location.origin}/c/${formattedPath}`;
      setShareLink(newLink);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving custom link:", error);
      setSaveError("Erro ao salvar o link. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Estilo de Decoração (Bordas)</label>
              <select 
                name="decorationType" 
                value={data.decorationType || 'none'} 
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
              >
                <optgroup label="2D Vetorial">
                  <option value="none">Sem decoração</option>
                  <option value="elegant">Elegante (Ramos/Arabescos)</option>
                  <option value="floral">Floral (Folhas)</option>
                  <option value="geometric">Geométrico (Art Deco)</option>
                  <option value="stars">Estrelas/Brilho</option>
                  <option value="butterflies">Borboletas</option>
                  <option value="delicate-flowers">Flores Delicadas</option>
                </optgroup>
                <optgroup label="3D Premium">
                  <option value="3d-rings">Anéis 3D Flutuantes</option>
                  <option value="3d-diamonds">Cristais/Diamantes 3D</option>
                </optgroup>
              </select>
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                <LinkIcon size={16} className="mr-2" />
                Personalizar Link
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Crie um link curto e amigável (ex: seusite.com/c/15-anos-julia).
              </p>

              {!user ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-3">Faça login para criar links personalizados.</p>
                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                  >
                    <LogIn size={16} className="mr-2" />
                    Entrar com Google
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <span className="px-3 text-gray-500 text-sm bg-gray-100 border-r border-gray-300">/c/</span>
                      <input 
                        type="text" 
                        placeholder="meu-evento"
                        value={customPath}
                        onChange={(e) => setCustomPath(e.target.value)}
                        className="flex-1 py-2 px-3 text-sm focus:outline-none bg-transparent"
                      />
                    </div>
                    {saveError && <p className="text-xs text-red-600 mt-1">{saveError}</p>}
                    {saveSuccess && <p className="text-xs text-green-600 mt-1">Link personalizado criado com sucesso!</p>}
                  </div>
                  
                  <button 
                    onClick={handleSaveCustomLink}
                    disabled={isSaving || !customPath.trim()}
                    className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                    Salvar Link Personalizado
                  </button>
                </div>
              )}
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
