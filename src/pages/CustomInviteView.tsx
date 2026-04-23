import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Invitation from '../components/Invitation';
import { InvitationData } from '../types';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function CustomInviteView() {
  const { customPath } = useParams();
  const [data, setData] = useState<InvitationData | null>(null);
  const [status, setStatus] = useState<'draft' | 'active' | null>(null);
  const [ownerUid, setOwnerUid] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u) {
        try {
          const uDoc = await getDoc(doc(db, 'users', u.uid));
          if (uDoc.exists() && uDoc.data().role === 'admin') setIsAdmin(true);
        } catch(e) {
          console.error(e);
        }
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!customPath) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'invitations', customPath);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          const inviteData = docData.data as InvitationData;
          setData(inviteData);
          setStatus(docData.status || 'draft');
          setOwnerUid(docData.ownerUid);

          // Update Open Graph tags dynamically for crawlers/messengers that support CSR evaluation
          if (inviteData) {
            document.title = `Convite de ${inviteData.title} - ${inviteData.name}`;
            
            const setMeta = (name: string, property: string, content: string) => {
              let meta = document.querySelector(`meta[property="${property}"]`);
              if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
              }
              meta.setAttribute('content', content);
            };

            setMeta('og:title', 'og:title', `Convite: ${inviteData.title} de ${inviteData.name}`);
            setMeta('og:description', 'og:description', `Você foi convidado! Data: ${inviteData.date.split('-').reverse().join('/')} às ${inviteData.time}. Toque para abrir o convite interativo.`);
            if (inviteData.images?.cover) {
              setMeta('og:image', 'og:image', inviteData.images.cover);
            }
          }
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error fetching invitation:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [customPath]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Convite não encontrado</h1>
        <p className="text-gray-400 mb-8">O link pode estar quebrado ou o convite foi removido.</p>
        <a href="/" className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
          Criar meu convite
        </a>
      </div>
    );
  }

  const isOwner = currentUser?.uid === ownerUid;
  const canView = status === 'active' || isOwner || isAdmin;

  if (!canView) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-amber-500">Convite Inativo</h1>
        <p className="text-gray-400 max-w-md">Este convite ainda está em modo rascunho e não foi ativado pelo proprietário para visualização pública.</p>
      </div>
    );
  }

  return (
    <>
      <Invitation data={data} key={customPath} />
      {status === 'draft' && (isOwner || isAdmin) && (
        <div className="fixed bottom-0 inset-x-0 bg-red-600/90 text-white text-xs py-2 text-center z-50 backdrop-blur-sm">
          Apenas você está vendo este convite. Ele está em <strong>Rascunho</strong> e invisível para seus convidados.
        </div>
      )}
    </>
  );
}
