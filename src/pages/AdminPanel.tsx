import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, setDoc, deleteDoc, updateDoc, Timestamp, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Users, LayoutTemplate, Shield, ArrowLeft, LogOut, CheckCircle, Trash2, Edit2 } from 'lucide-react';

interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

interface InvitationData {
  id: string;
  ownerUid: string;
  createdAt: Timestamp;
  status?: 'draft' | 'active';
  // data is complex, we just need basic info for list
}

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Verify admin status
        const userDoc = await getDocs(query(collection(db, 'users')));
        const me = userDoc.docs.find(d => d.id === user.uid)?.data() as AppUser;
        
        if (me && me.role === 'admin') {
          setAppUser(me);
          fetchData();
        } else {
          // You are not an admin
          navigate('/');
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const usersSnap = await getDocs(query(collection(db, 'users')));
      setUsers(usersSnap.docs.map(d => d.data() as AppUser));

      const invitesSnap = await getDocs(query(collection(db, 'invitations')));
      setInvitations(invitesSnap.docs.map(d => d.data() as InvitationData));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const promoteToAdmin = async (uid: string) => {
    if (!window.confirm("Promover a administrador?")) return;
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { role: 'admin' }, { merge: true });
      fetchData();
    } catch(e) { console.error(e); }
  };

  const demoteToUser = async (uid: string) => {
    if (!window.confirm("Remover cargo de administrador?")) return;
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { role: 'user' }, { merge: true });
      fetchData();
    } catch(e) { console.error(e); }
  };

  const deleteInvite = async (id: string) => {
    if (!window.confirm("Apagar convite permanentemente?")) return;
    try {
      await deleteDoc(doc(db, 'invitations', id));
      fetchData();
    } catch (e) { console.error(e); }
  }

  const toggleInviteStatus = async (id: string, newStatus: 'draft' | 'active') => {
    if (!window.confirm(`Mudar status para ${newStatus === 'active' ? 'Ativo (Público)' : 'Pendente (Privado)'}?`)) return;
    try {
      const inviteRef = doc(db, 'invitations', id);
      const docSnap = await getDoc(inviteRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const payload: any = { status: newStatus };
        
        // Fix missing properties on legacy invites
        if (!currentData.createdAt) payload.createdAt = serverTimestamp();
        if (!currentData.id) payload.id = id;
        
        await setDoc(inviteRef, payload, { merge: true });
        fetchData();
      }
    } catch(e: any) { 
        console.error(e);
        alert("Erro ao atualizar o status: " + (e.message || e));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (isLoading || !appUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <Shield className="text-indigo-600" size={24} />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin</h1>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Users size={18} /> Usuários
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'invitations' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <LayoutTemplate size={18} /> Convites
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <img src={appUser.photoURL} alt="Admin" className="w-10 h-10 rounded-full border border-gray-200" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{appUser.displayName}</p>
              <p className="text-xs text-indigo-600 font-semibold">Super Admin</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowLeft size={16} /> Voltar ao Site
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Usuários Cadastrados ({users.length})</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-700">
                      <tr>
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Data de Cadastro</th>
                        <th className="px-6 py-4">Cargo</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} alt="" className="w-8 h-8 rounded-full" />
                              <span className="font-medium text-gray-900">{u.displayName || 'Sem Nome'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.createdAt ? new Date(u.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                              {u.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {u.role !== 'admin' ? (
                              <button onClick={() => promoteToAdmin(u.uid)} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">Tornar Admin</button>
                            ) : (
                              u.email !== 'eduardokainan.senai@gmail.com' && (
                                <button onClick={() => demoteToUser(u.uid)} className="text-orange-600 hover:text-orange-900 font-medium text-xs">Remover Admin</button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invitations' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Convites Gerados ({invitations.length})</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-700">
                      <tr>
                        <th className="px-6 py-4">Link (ID)</th>
                        <th className="px-6 py-4">Autor UID</th>
                        <th className="px-6 py-4">Criado Em</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invitations.map((inv) => (
                        <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">
                            <a href={`/c/${inv.id}`} target="_blank" rel="noreferrer">/c/{inv.id}</a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px]" title={inv.ownerUid}>
                            {inv.ownerUid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {inv.createdAt ? new Date(inv.createdAt.seconds * 1000).toLocaleString('pt-BR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${inv.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {inv.status === 'active' ? 'Ativo' : 'Pendente (Rascunho)'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                            {inv.status === 'active' ? (
                              <button onClick={() => toggleInviteStatus(inv.id, 'draft')} className="text-amber-600 hover:text-amber-900 font-medium text-xs">Pausar</button>
                            ) : (
                              <button onClick={() => toggleInviteStatus(inv.id, 'active')} className="text-emerald-600 hover:text-emerald-900 font-medium text-xs">Aprovar PIX</button>
                            )}
                            <button onClick={() => window.open(`/c/${inv.id}`, '_blank')} className="text-gray-500 hover:text-gray-900 transition-colors" title="Visualizar">
                              <LayoutTemplate size={18} />
                            </button>
                            <button onClick={() => deleteInvite(inv.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Deletar Convite">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {invitations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      Nenhum convite salvo ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
