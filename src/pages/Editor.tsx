import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templates } from '../data/templates';
import { InvitationData } from '../types';
import Invitation from '../components/Invitation';
import { ArrowLeft, Share2, Smartphone, Copy, Check, Link as LinkIcon, LogIn, Loader2, Save, ChevronDown, ChevronUp, Sparkles, Palette, Type, Image as ImageIcon, Music, MapPin, Calendar, MessageCircle, Lock } from 'lucide-react';
import LZString from 'lz-string';
import { auth, db, saveUserToDb } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { trackEvent } from '../lib/analytics';

const AccordionSection = ({ title, icon: Icon, isOpen, onToggle, children }: any) => (
  <div className="border-b border-gray-100 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-6 bg-white hover:bg-gray-50 transition-colors focus:outline-none"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
          <Icon size={18} />
        </div>
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    {isOpen && (
      <div className="px-6 pb-6 pt-2 bg-white space-y-5 animate-in slide-in-from-top-2 duration-200">
        {children}
      </div>
    )}
  </div>
);

export default function Editor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InvitationData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('event');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  
  // Firebase Auth & Custom Link States
  const [user, setUser] = useState<User | null>(null);
  const [customPath, setCustomPath] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'draft' | 'active'>('draft');
  const [pixCopied, setPixCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        saveUserToDb(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load from draft or template
  useEffect(() => {
    if (!templateId) {
      navigate('/');
      return;
    }

    const draftKey = `draft_${templateId}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        setData(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Failed to parse saved draft", e);
        const template = templates.find(t => t.id === templateId);
        if (template) setData(template.defaultData);
      }
    } else {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setData(template.defaultData);
      } else {
        navigate('/');
      }
    }
  }, [templateId, navigate]);

  // Auto-save to draft
  useEffect(() => {
    if (data && templateId) {
      const draftKey = `draft_${templateId}`;
      localStorage.setItem(draftKey, JSON.stringify(data));
    }
  }, [data, templateId]);

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
        createdAt: docSnap.exists() ? docSnap.data().createdAt : serverTimestamp(),
        status: docSnap.exists() ? docSnap.data().status : 'draft'
      });

      setInviteStatus(docSnap.exists() ? docSnap.data().status : 'draft');
      const newLink = `${window.location.origin}/c/${formattedPath}`;
      setShareLink(newLink);
      setSaveSuccess(true);
      
      trackEvent('Lead', { 
        content_name: 'Custom Invitation',
        content_category: data?.category,
        customPath: formattedPath, 
        templateId, 
        isNew: !docSnap.exists()
      });
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
    trackEvent('copy_link', { templateId, method: inviteStatus === 'active' ? 'custom' : 'stateless' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="md:hidden flex bg-white p-2 border-b border-gray-200 justify-around sticky top-0 z-20">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-3 text-center text-sm font-medium rounded-lg transition-colors ${mobileView === 'edit' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Editar
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-3 justify-center flex items-center text-sm font-medium rounded-lg transition-colors ${mobileView === 'preview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Smartphone size={16} className="mr-2"/>
          Preview
        </button>
      </div>

      {/* Left Panel - Editor Form */}
      <div className={`${mobileView === 'edit' ? 'flex' : 'hidden'} w-full md:w-1/2 lg:w-2/5 bg-white shadow-xl z-10 md:flex flex-col h-[calc(100vh-64px)] md:h-screen`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white flex-wrap gap-2">
          <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setShowModal(true);
              }} 
              className="flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_0_15px_rgba(5,150,105,0.3)]"
            >
              <Sparkles size={16} className="mr-2" />
              Publicar Convite
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 bg-white border-b border-gray-100">
            <h2 className="text-2xl font-serif font-medium text-gray-900 mb-1">Editar Convite</h2>
            <p className="text-sm text-gray-500">Personalize cada detalhe do seu evento.</p>
          </div>

          <div className="space-y-0">
            <AccordionSection 
              title="Informações do Evento" 
              icon={Calendar} 
              isOpen={activeSection === 'event'} 
              onToggle={() => setActiveSection(activeSection === 'event' ? '' : 'event')}
            >
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
            </AccordionSection>

            <AccordionSection 
              title="Local e Mensagem" 
              icon={MapPin} 
              isOpen={activeSection === 'location'} 
              onToggle={() => setActiveSection(activeSection === 'location' ? '' : 'location')}
            >
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
            </AccordionSection>

            <AccordionSection 
              title="Mídia e Links" 
              icon={ImageIcon} 
              isOpen={activeSection === 'media'} 
              onToggle={() => setActiveSection(activeSection === 'media' ? '' : 'media')}
            >
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
                <label className="block text-sm font-medium text-gray-700">URL da Música (Recomendado: Dropbox)</label>
                <input type="text" name="musicUrl" value={data.musicUrl} onChange={handleChange} placeholder="https://www.dropbox.com/s/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                <p className="mt-1 text-[11px] text-gray-500 leading-tight pt-1">
                  <strong className="font-semibold text-red-600">Atenção ao Google Drive:</strong> Devido às novas restrições de segurança globais do Google Drive (CORS), navegadores não tocam áudio escondido dele. 
                  O ideal é subir seu MP3 no <strong className="text-blue-600">Dropbox</strong>. Basta colar o link de compartilhamento do seu Dropbox aqui que nós adaptamos o áudio para tocar automaticamente!
                </p>
              </div>
            </AccordionSection>

            <AccordionSection 
              title="Design e Cores" 
              icon={Palette} 
              isOpen={activeSection === 'design'} 
              onToggle={() => setActiveSection(activeSection === 'design' ? '' : 'design')}
            >
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
                <label className="block text-sm font-medium text-gray-700">Textura de Fundo</label>
                <select 
                  name="pageBackground" 
                  value={data.pageBackground || 'solid'} 
                  onChange={handleChange} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                >
                  <option value="solid">Cor Sólida</option>
                  <option value="paper">Papel Texturizado</option>
                  <option value="marble">Mármore Elegante</option>
                  <option value="floral-light">Floral Suave (Claro)</option>
                  <option value="floral-dark">Floral Noturno (Escuro)</option>
                  <option value="geometric">Padrão Geométrico</option>
                  <option value="stars">Céu Estrelado</option>
                </select>
              </div>
            </AccordionSection>

            <AccordionSection 
              title="Ornamentos Premium" 
              icon={Sparkles} 
              isOpen={activeSection === 'ornaments'} 
              onToggle={() => setActiveSection(activeSection === 'ornaments' ? '' : 'ornaments')}
            >

            <div>
              <label className="block text-sm font-medium text-gray-700">Estilo de Decoração (Bordas)</label>
              <select 
                name="decorationType" 
                value={data.decorationType || 'none'} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('3d-')) {
                    // Map old 3D types to new ornament packs for backward compatibility
                    let packId = 'none';
                    if (val === '3d-spheres') packId = 'pearls-premium';
                    else if (val === '3d-rings') packId = 'rings-metallic';
                    else if (val === '3d-diamonds' || val === '3d-crystals') packId = 'crystals-elegant';
                    
                    handleChange({ target: { name: 'ornamentConfig', value: { packId, intensity: 0.5, delicacy: 0.5, quantity: 0.5, movement: 0.5 } } } as any);
                    handleChange({ target: { name: 'decorationType', value: 'none' } } as any);
                  } else {
                    handleChange(e);
                    handleChange({ target: { name: 'ornamentConfig', value: { packId: 'none', intensity: 0, delicacy: 0, quantity: 0, movement: 0 } } } as any);
                  }
                }} 
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
                  <option value="3d-rings">Aros Metálicos Finos</option>
                  <option value="3d-spheres">Pérolas Premium</option>
                  <option value="3d-crystals">Cristais Elegantes</option>
                </optgroup>
              </select>
            </div>

            {data.ornamentConfig && data.ornamentConfig.packId !== 'none' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">Ajustes Finos 3D</h4>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700">Delicadeza (Escala/Espessura)</label>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={data.ornamentConfig.delicacy} 
                    onChange={(e) => handleChange({ target: { name: 'ornamentConfig', value: { ...data.ornamentConfig, delicacy: parseFloat(e.target.value) } } } as any)} 
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700">Quantidade</label>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={data.ornamentConfig.quantity} 
                    onChange={(e) => handleChange({ target: { name: 'ornamentConfig', value: { ...data.ornamentConfig, quantity: parseFloat(e.target.value) } } } as any)} 
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Movimento</label>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={data.ornamentConfig.movement} 
                    onChange={(e) => handleChange({ target: { name: 'ornamentConfig', value: { ...data.ornamentConfig, movement: parseFloat(e.target.value) } } } as any)} 
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}

            {(!data.ornamentConfig || data.ornamentConfig.packId === 'none') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tamanho da Decoração 2D</label>
                  <div className="flex items-center gap-4 mt-1">
                    <input 
                      type="range" 
                      name="decorationScale" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      value={data.decorationScale || 1} 
                      onChange={(e) => handleChange({ target: { name: 'decorationScale', value: parseFloat(e.target.value) } } as any)} 
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500 w-8">{Math.round((data.decorationScale || 1) * 100)}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Posição Horizontal (X)</label>
                  <div className="flex items-center gap-4 mt-1">
                    <input 
                      type="range" 
                      name="decorationOffsetX" 
                      min="-200" 
                      max="200" 
                      step="1" 
                      value={data.decorationOffsetX || 0} 
                      onChange={(e) => handleChange({ target: { name: 'decorationOffsetX', value: parseInt(e.target.value) } } as any)} 
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500 w-8">{data.decorationOffsetX || 0}px</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Posição Vertical (Y)</label>
                  <div className="flex items-center gap-4 mt-1">
                    <input 
                      type="range" 
                      name="decorationOffsetY" 
                      min="-200" 
                      max="200" 
                      step="1" 
                      value={data.decorationOffsetY || 0} 
                      onChange={(e) => handleChange({ target: { name: 'decorationOffsetY', value: parseInt(e.target.value) } } as any)} 
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500 w-8">{data.decorationOffsetY || 0}px</span>
                  </div>
                </div>
              </>
            )}
            </AccordionSection>

            <AccordionSection 
              title="Tipografia" 
              icon={Type} 
              isOpen={activeSection === 'typography'} 
              onToggle={() => setActiveSection(activeSection === 'typography' ? '' : 'typography')}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Fonte do Título</label>
                <select name="fontTitle" value={data.theme.fontTitle} onChange={handleThemeChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white">
                  <option value='"Playfair Display", serif'>Playfair Display (Serif)</option>
                  <option value='"Cinzel", serif'>Cinzel (Serif)</option>
                  <option value='"Montserrat", sans-serif'>Montserrat (Sans)</option>
                  <option value='"Cormorant Garamond", serif'>Cormorant Garamond</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fonte Cursiva (Destaques)</label>
                <select name="fontScript" value={data.theme.fontScript} onChange={handleThemeChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white">
                  <option value='"Great Vibes", cursive'>Great Vibes</option>
                  <option value='"Dancing Script", cursive'>Dancing Script</option>
                  <option value='"Pinyon Script", cursive'>Pinyon Script</option>
                  <option value='"Alex Brush", cursive'>Alex Brush</option>
                  <option value='"Parisienne", cursive'>Parisienne</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fonte do Texto</label>
                <select name="fontBody" value={data.theme.fontBody} onChange={handleThemeChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white">
                  <option value='"Montserrat", sans-serif'>Montserrat</option>
                  <option value='"Lato", sans-serif'>Lato</option>
                  <option value='"Open Sans", sans-serif'>Open Sans</option>
                  <option value='"Lora", serif'>Lora</option>
                </select>
              </div>
            </AccordionSection>
          </div>
          
          <div className="pb-10"></div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className={`${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 bg-[#FDFBF7] items-center justify-center p-8 h-[calc(100vh-64px)] md:h-screen overflow-hidden relative border-l border-gray-200`}>
        <div className="absolute top-6 right-6 hidden md:flex bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm items-center text-sm font-medium text-gray-700 border border-gray-200/50 z-10">
          <Smartphone size={16} className="mr-2 text-amber-600" />
          Preview em Tempo Real
        </div>
        
        {/* Mobile Mockup - Scaled using wrapper to maintain center position */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[375px] h-[812px] bg-white md:rounded-[3rem] md:shadow-2xl overflow-hidden md:border-[8px] border-gray-900 relative md:ring-1 ring-gray-900/5 transform transition-transform duration-500 rounded-none border-0 shadow-none scale-[0.85] sm:scale-100 md:scale-[0.70] lg:scale-[0.80] xl:scale-[0.90] 2xl:scale-100 origin-center">
            {/* Notch - only on desktop mockup view */}
            <div className="hidden md:flex absolute top-0 inset-x-0 h-7 bg-gray-900 rounded-b-3xl w-40 mx-auto z-50 justify-center items-end pb-1.5">
              <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
            </div>
            
            {/* Invitation Component */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar bg-white shadow-xl md:shadow-none relative outline outline-1 outline-gray-200">
              <Invitation data={data} key={mobileView} />
            </div>
          </div>
        </div>
      </div>

      {/* Combined Publish/Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header depending on state */}
            <div className={`p-6 text-white text-center ${inviteStatus === 'active' ? 'bg-indigo-600' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'}`}>
              <h3 className="text-xl font-bold mb-2">
                {inviteStatus === 'active' ? 'Seu Convite está Pronto!' : 'Publicar Convite'}
              </h3>
              <p className="text-sm opacity-90">
                {inviteStatus === 'active' ? 'Compartilhe o link com seus convidados.' : 'Siga os passos abaixo para liberar seu link personalizado.'}
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!user ? (
                /* STEP 1: LOGIN */
                <div key="step-login" className="text-center py-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Lock size={28} className="text-gray-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Salvar meu Convite</h4>
                  <p className="text-sm text-gray-600 mb-6">Você precisa criar uma conta gratuita para salvar seu convite e escolher o seu link.</p>
                  <button 
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium shadow-sm"
                  >
                    <LogIn size={20} className="mr-3" />
                    Continuar com Google
                  </button>
                </div>
              ) : (!saveSuccess && inviteStatus === 'draft') ? (
                /* STEP 2: CHOOSE LINK */
                <div key="step-choose-link" className="py-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Escolha seu Link</h4>
                  <p className="text-sm text-gray-600 mb-6">Crie um link fácil de lembrar para enviar aos convidados.</p>
                  
                  <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all mb-2">
                    <span className="px-4 py-3 text-gray-500 font-medium bg-gray-100 border-r border-gray-200">/c/</span>
                    <input 
                      type="text" 
                      placeholder="ana-e-joao"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      className="flex-1 py-3 px-4 focus:outline-none bg-transparent font-medium text-gray-900"
                    />
                  </div>
                  
                  {saveError && <p className="text-sm text-red-600 mb-4">{saveError}</p>}
                  
                  <button 
                    onClick={handleSaveCustomLink}
                    disabled={isSaving || !customPath.trim()}
                    className="w-full flex items-center justify-center bg-emerald-600 text-white px-4 py-3.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-sm"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
                    Salvar e Avançar
                  </button>
                </div>
              ) : (inviteStatus === 'draft') ? (
                /* STEP 3: PAYMENT */
                <div key="step-payment" className="py-2">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Seu Link:</p>
                      <p className="font-medium text-emerald-700">/c/{customPath}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check size={16} />
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">2. Validação e Pagamento</h4>
                  <p className="text-sm text-gray-600 mb-4">Para liberar o acesso dos convidados ao seu link, faça um PIX único de <strong>R$ 20,00</strong>.</p>
                  
                  <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100 mb-6 flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-orange-100 mb-4 w-full">
                      <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold text-center mb-1">Chave PIX (E-mail)</p>
                      <div className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                        <p className="font-mono font-bold text-gray-900 text-sm tracking-tight break-all">
                          kainan.digital@gmail.com
                        </p>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('kainan.digital@gmail.com');
                            setPixCopied(true);
                            setTimeout(() => setPixCopied(false), 2000);
                          }}
                          className={`ml-2 p-2 rounded transition-colors ${pixCopied ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                          title="Copiar Chave PIX"
                        >
                          {pixCopied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center w-full bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-0.5">Nome do Recebedor:</p>
                      <p className="text-sm font-semibold text-gray-800">EDUARDO KAINAN LEITE SOUSA</p>
                    </div>
                  </div>
                  
                  <a 
                    href={`https://wa.me/5562982042056?text=${encodeURIComponent(`Olá! Fiz o pagamento para liberar meu convite. O link que escolhi foi o /c/${customPath}. Aqui está o comprovante:`)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3.5 rounded-xl font-medium hover:bg-[#1EBE5D] transition-colors shadow-sm"
                  >
                    <MessageCircle size={20} />
                    Enviar Comprovante
                  </a>
                </div>
              ) : (
                /* STEP 4: ACTIVE & SHARE */
                <div key="step-active" className="py-2 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Convite Liberado!</h4>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareLink} 
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-600 focus:outline-none"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors flex items-center justify-center shrink-0 shadow-sm"
                      title="Copiar Link"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  
                  <a 
                    href={shareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Abrir Convite
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
              <button 
                onClick={() => setShowModal(false)} 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 px-6 py-2 transition-colors"
              >
                {inviteStatus === 'active' ? 'Fechar' : 'Fechar e Continuar Depois'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
