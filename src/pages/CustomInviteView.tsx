import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Invitation from '../components/Invitation';
import { InvitationData } from '../types';

export default function CustomInviteView() {
  const { customPath } = useParams();
  const [data, setData] = useState<InvitationData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setData(docSnap.data().data as InvitationData);
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

  if (loading) {
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

  return <Invitation data={data} />;
}
