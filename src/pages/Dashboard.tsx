import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templates } from '../data/templates';
import { Sparkles, Filter, Search, LogIn, LogOut, Shield, Trash2, Edit2, PlayCircle, Loader2, LayoutTemplate, Check, ArrowRight } from 'lucide-react';
import { auth, saveUserToDb, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

import { deleteInvitationAndFiles } from '../lib/invitationManager';

const WistiaEmbed = () => {
  useEffect(() => {
    if (!document.getElementById('wistia-player-script')) {
      const script1 = document.createElement('script');
      script1.id = 'wistia-player-script';
      script1.src = "https://fast.wistia.com/player.js";
      script1.async = true;
      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.id = 'wistia-embed-script';
      script2.src = "https://fast.wistia.com/embed/qpwj726qzg.js";
      script2.async = true;
      script2.type = "module";
      document.body.appendChild(script2);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <style>{`wistia-player[media-id='qpwj726qzg']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/qpwj726qzg/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }`}</style>
      {React.createElement('wistia-player', { 'media-id': 'qpwj726qzg', aspect: '1.7777777777777777' })}
    </div>
  );
};

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'my-invites' | 'packages'>('catalog');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [myFirebaseInvites, setMyFirebaseInvites] = useState<any[]>([]);
  const [myLocalDrafts, setMyLocalDrafts] = useState<any[]>([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await saveUserToDb(currentUser);
        // Check role and credits
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setUserCredits(data.credits || 0);
        }
      } else {
        setIsAdmin(false);
        setUserCredits(0);
        setCurrentTab('catalog'); // Reset if logged out
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMyInvites = async () => {
    setIsLoadingInvites(true);
    // Local Drafts
    const drafts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('draft_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key)!);
          const templateId = key.replace('draft_', '');
          drafts.push({ key, templateId, data });
        } catch (e) {}
      }
    }
    setMyLocalDrafts(drafts);

    // Firebase
    if (user) {
      try {
        const q = query(collection(db, 'invitations'), where('ownerUid', '==', user.uid));
        const snap = await getDocs(q);
        const fInvites = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMyFirebaseInvites(fInvites);
      } catch (e) {
        console.error(e);
      }
    } else {
      setMyFirebaseInvites([]);
    }
    setIsLoadingInvites(false);
  };

  useEffect(() => {
    if (currentTab === 'my-invites') {
      fetchMyInvites();
    }
  }, [currentTab, user]);

  const handleDeleteLocal = (key: string) => {
    if (window.confirm('Excluir este rascunho permanentemente deste dispositivo?')) {
      localStorage.removeItem(key);
      fetchMyInvites();
    }
  };

  const handleDeleteFirebase = async (id: string) => {
    if (window.confirm('Excluir link de convite e todos os seus arquivos permanentemente?')) {
      try {
        await deleteInvitationAndFiles(id);
        fetchMyInvites();
      } catch (e) {
        console.error(e);
        alert('Erro ao excluir convite. Verifique suas permissões.');
      }
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const categories = ['Todos', 'Casamento', '15 Anos', 'Infantil', 'Aniversário', 'Chá Revelação', 'Chá de Bebê', 'Corporativo'];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === 'Todos' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <span className="text-xl font-serif font-medium tracking-tight">Lumière Invites</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <button onClick={() => setCurrentTab('catalog')} className={`${currentTab === 'catalog' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : 'text-gray-900 hover:text-amber-600'} pb-1 transition-colors`}>Catálogo</button>
            <button onClick={() => setCurrentTab('packages')} className={`${currentTab === 'packages' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : 'text-gray-900 hover:text-amber-600'} pb-1 transition-colors flex items-center gap-1.5`}>
              Revenda
              {user && userCredits > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 flex items-center h-4 rounded-full">
                  {userCredits} CRÉDITOS
                </span>
              )}
            </button>
            <button onClick={() => {
              if (user) {
                setCurrentTab('my-invites');
              } else {
                handleLogin();
              }
            }} className={`${currentTab === 'my-invites' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : 'text-gray-900 hover:text-amber-600'} pb-1 transition-colors`}>
              Meus Convites
            </button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            {!user ? (
              <button onClick={handleLogin} className="flex items-center gap-2 text-sm font-medium bg-gray-900 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm">
                <LogIn size={16} /> <span className="hidden sm:inline">Entrar</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-indigo-100 transition-colors" title="Painel Admin">
                    <Shield size={16} /> <span className="hidden sm:inline">Painel Admin</span>
                  </Link>
                )}
                {user.photoURL && <img src={user.photoURL} alt={user.displayName || "User"} className="hidden sm:block w-8 h-8 rounded-full border border-gray-200" />}
                <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-gray-200 transition-colors" title="Sair">
                  <LogOut size={16} /> <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-28 md:pb-16">
        {currentTab === 'catalog' ? (
          <>
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-24 mt-4">
              <div className="lg:w-1/2 flex flex-col justify-center text-left">
                <div className="inline-block bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs tracking-wider mb-6 w-max uppercase shadow-sm">
                  🔥 O Fim dos Convites de Papel
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                  Seu Convite Digital Pronto em <span className="text-amber-600">Menos de 5 Minutos!</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                  Chega de pagar caro em gráficas e pagar frete. Envie diretamente pelo WhatsApp um convite interativo que impressiona qualquer convidado, sem depender de ninguém.
                </p>
                <ul className="space-y-4 mb-10 text-gray-700 font-medium text-sm sm:text-base">
                  <li className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shrink-0"><Check size={16} strokeWidth={3}/></div>
                    <span><strong>Confirmação de Presença (RSVP)</strong> direto no seu WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shrink-0"><Check size={16} strokeWidth={3}/></div>
                    <span>Botão com o <strong>Mapa (GPS)</strong> até o local da festa</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 shrink-0"><Check size={16} strokeWidth={3}/></div>
                    <span>Receba presentes em dinheiro direto na <strong>Chave PIX</strong></span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => {
                    document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    Criar Meu Convite Agora <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/2 w-full">
                <div className="bg-white p-2 sm:p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 relative">
                  <div className="absolute -top-4 -right-4 md:-right-6 bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg uppercase tracking-wider transform rotate-3 z-10 hidden sm:block">
                    Aperte o Play
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-inner relative w-full aspect-video">
                    <WistiaEmbed />
                  </div>
                </div>
              </div>
            </div>

            <div id="catalog-grid" className="scroll-mt-32">
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Escolha o Seu Design Perfeito</h2>
                <p className="text-gray-500 mb-8 font-medium text-lg">Todos os modelos abaixo vêm com as ferramentas interativas inclusas. Não precisa saber programar nem desenhar.</p>
                
                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500 sm:text-sm shadow-sm bg-white font-medium"
                    placeholder="Buscar por estilo, ocasião ou cor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-full border border-gray-200">
                <Filter className="w-4 h-4" />
                Mais Filtros
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTemplates.map((template) => {
                const hasDraft = localStorage.getItem(`draft_${template.id}`);
                
                return (
                  <div key={template.id} className="group relative flex flex-col">
                    <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                      <img
                        src={template.coverImage}
                        alt={template.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                        <Link
                          to={`/editor/${template.id}`}
                          onClick={() => {
                            // If they click 'Novo', clear any draft
                            localStorage.removeItem(`draft_${template.id}`);
                            import('../lib/analytics').then(({ trackEvent }) => {
                              trackEvent('InitiateCheckout', {
                                content_ids: [template.id],
                                content_name: template.name,
                                content_category: template.category,
                                action: 'criar_novo'
                              });
                            });
                          }}
                          className="w-full flex items-center justify-center px-4 py-3 rounded-full text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors shadow-lg"
                        >
                          Criar Novo
                        </Link>
                        {hasDraft && (
                          <Link
                            to={`/editor/${template.id}`}
                            onClick={() => {
                              import('../lib/analytics').then(({ trackEvent }) => {
                                trackEvent('InitiateCheckout', {
                                  content_ids: [template.id],
                                  content_name: template.name,
                                  content_category: template.category,
                                  action: 'continuar_edicao'
                                });
                              });
                            }}
                            className="w-full flex items-center justify-center px-4 py-3 rounded-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg"
                          >
                            Continuar Edição
                          </Link>
                        )}
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm">
                          {template.category}
                        </span>
                        {hasDraft && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 backdrop-blur-sm text-indigo-800 shadow-sm">
                            Rascunho Salvo
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Design Premium</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Nenhum modelo encontrado para sua busca.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('Todos');}}
                  className="mt-4 text-amber-600 font-medium hover:text-amber-700"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        ) : currentTab === 'my-invites' ? (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif font-medium text-gray-900 mb-8">Todos os Meus Convites</h1>
            
            {isLoadingInvites ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-amber-600 animate-spin" /></div>
            ) : myFirebaseInvites.length === 0 && myLocalDrafts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutTemplate size={32} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Você ainda não criou nenhum convite</h3>
                <p className="text-gray-500 mb-6">Explore nosso catálogo e comece a criar o design perfeito para o seu evento.</p>
                <button onClick={() => setCurrentTab('catalog')} className="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition">
                  Ver Modelos
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* FIREBASE INVITES SECTION */}
                {myFirebaseInvites.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-2xl font-serif text-gray-900">Na Nuvem (Links Prontos)</h2>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Salvo</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myFirebaseInvites.map(inv => (
                        <div key={inv.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                          <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1">{inv.data?.category || 'Convite'}</p>
                              <h3 className="font-serif text-lg font-medium text-gray-900 leading-tight">{inv.data?.title || 'Sem Título'}</h3>
                              <p className="text-sm text-gray-500 mt-1 truncate max-w-[200px]">{inv.data?.name || ''}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-md font-medium border ${inv.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {inv.status === 'active' ? 'Ativo' : 'Rascunho Privado'}
                            </span>
                          </div>
                          <div className="p-5">
                            <p className="text-xs text-gray-500 mb-4 font-mono truncate">
                              /c/{inv.id}
                            </p>
                            <div className="flex items-center gap-2">
                              <a href={`/c/${inv.id}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                                <PlayCircle size={16} /> Abrir
                              </a>
                              <Link to={`/editor/${inv.data?.templateId || 'casamento-moderno'}?edit=${inv.id}`} className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition" title="Editar Convite">
                                <Edit2 size={18} />
                              </Link>
                              <button onClick={() => handleDeleteFirebase(inv.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Excluir Convite">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* LOCAL DRAFTS SECTION */}
                {myLocalDrafts.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <h2 className="text-2xl font-serif text-gray-900">Rascunhos Incompletos</h2>
                      <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Neste Dispositivo</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myLocalDrafts.map(draft => (
                        <div key={draft.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                          <div className="p-5 border-b border-gray-100">
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">{draft.data?.category || 'Convite'}</p>
                            <h3 className="font-serif text-lg font-medium text-gray-900 leading-tight truncate">{draft.data?.title || 'Sem Título'}</h3>
                          </div>
                          <div className="p-5 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Link to={`/editor/${draft.templateId}`} className="flex-1 flex items-center justify-center gap-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 py-2.5 rounded-lg text-sm font-medium transition">
                                <Edit2 size={16} /> Continuar Edição
                              </Link>
                              <button onClick={() => handleDeleteLocal(draft.key)} className="p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir Rascunho">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-serif font-medium text-gray-900 mb-4">Pacotes de Revenda</h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">Compre créditos com desconto, gere links para seus clientes instantaneamente sem precisar aguardar aprovação e libere ferramentas exclusivas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pacote Start */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="p-8 text-center border-b border-gray-100 bg-gray-50 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Plano START</h3>
                  <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">5 CRÉDITOS</div>
                  <div className="flex justify-center items-baseline mb-2">
                    <span className="text-3xl font-bold text-gray-900">R$ 49</span>
                    <span className="text-lg font-medium text-gray-500">,90</span>
                  </div>
                  <p className="text-sm text-gray-500">Sai a apenas R$ 9,98 por convite.</p>
                </div>
                <div className="p-6 bg-white">
                  <a href="https://wa.me/55XX999999999?text=Ol%C3%A1%21+Gostaria+de+adquirir+o+Plano+START+de+5+cr%C3%A9ditos." target="_blank" rel="noreferrer" className="w-full block text-center py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors">
                    Solicitar via WhatsApp
                  </a>
                </div>
              </div>

              {/* Pacote Pro (Destaque) */}
              <div className="bg-gray-900 rounded-3xl border-2 border-amber-500 overflow-hidden shadow-2xl relative transform md:-translate-y-4 flex flex-col z-10">
                <div className="absolute top-0 inset-x-0 bg-amber-500 text-white text-[10px] font-bold tracking-widest text-center py-1.5 uppercase">Mais Popular</div>
                <div className="p-8 text-center border-b border-gray-800 bg-gray-900/50 flex-1 pt-10">
                  <h3 className="text-xl font-bold text-white mb-2">Plano PRO</h3>
                  <div className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">10 CRÉDITOS</div>
                  <div className="flex justify-center items-baseline mb-2 text-white">
                    <span className="text-4xl font-bold">R$ 69</span>
                    <span className="text-xl font-medium text-gray-400">,90</span>
                  </div>
                  <p className="text-sm text-gray-400">Sai a apenas R$ 6,99 por convite.</p>
                </div>
                <div className="p-6 bg-gray-900">
                  <a href="https://wa.me/55XX999999999?text=Ol%C3%A1%21+Gostaria+de+adquirir+o+Plano+PRO+de+10+cr%C3%A9ditos." target="_blank" rel="noreferrer" className="w-full block text-center py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors">
                    Solicitar via WhatsApp
                  </a>
                </div>
              </div>

              {/* Pacote Agency */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="p-8 text-center border-b border-gray-100 bg-gray-50 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Plano AGÊNCIA</h3>
                  <div className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">30 CRÉDITOS</div>
                  <div className="flex justify-center items-baseline mb-2">
                    <span className="text-3xl font-bold text-gray-900">R$ 129</span>
                    <span className="text-lg font-medium text-gray-500">,90</span>
                  </div>
                  <p className="text-sm text-gray-500">Sai a apenas R$ 4,33 por convite.</p>
                </div>
                <div className="p-6 bg-white">
                  <a href="https://wa.me/55XX999999999?text=Ol%C3%A1%21+Gostaria+de+adquirir+o+Plano+AG%C3%8ANCIA+de+30+cr%C3%A9ditos." target="_blank" rel="noreferrer" className="w-full block text-center py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors">
                    Solicitar via WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-8 max-w-3xl mx-auto">
              <h4 className="text-lg font-serif font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Como funciona a Revenda?
              </h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p>Você compra os créditos via PIX pelo WhatsApp.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p>Os créditos são adicionados automaticamente à sua conta.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p>Ao criar e publicar um convite, você não precisa mais esperar nossa aprovação manual do PIX de R$20. Basta clicar em <strong>"Publicar com 1 Crédito"</strong> e o link é liberado na hora.</p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 flex pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentTab('catalog')} 
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${currentTab === 'catalog' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Sparkles size={20} />
          <span className="text-[10px] font-medium tracking-wide">Catálogo</span>
        </button>
        <div className="w-px bg-gray-100 my-2"></div>
        <button 
          onClick={() => setCurrentTab('packages')} 
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${currentTab === 'packages' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className="relative">
            <Sparkles size={20} />
            {user && userCredits > 0 && <span className="absolute -top-1 -right-2 bg-amber-100 text-amber-800 text-[8px] font-bold px-1 rounded-full">{userCredits}</span>}
          </div>
          <span className="text-[10px] font-medium tracking-wide">Revenda</span>
        </button>
        <div className="w-px bg-gray-100 my-2"></div>
        <button 
          onClick={() => {
            if (user) {
              setCurrentTab('my-invites');
            } else {
              handleLogin();
            }
          }} 
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${currentTab === 'my-invites' ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutTemplate size={20} />
          <span className="text-[10px] font-medium tracking-wide">Meus Convites</span>
        </button>
      </nav>
    </div>
  );
}
