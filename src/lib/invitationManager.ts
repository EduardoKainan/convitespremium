import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export const deleteInvitationAndFiles = async (id: string): Promise<void> => {
  try {
    const inviteRef = doc(db, 'invitations', id);
    const docSnap = await getDoc(inviteRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Collect all potential storage URLs
      const urlsToDelete: string[] = [];
      
      if (data.images) {
        if (data.images.cover) urlsToDelete.push(data.images.cover);
        if (data.images.hero) urlsToDelete.push(data.images.hero);
        if (data.images.footer) urlsToDelete.push(data.images.footer);
      }
      if (data.musicUrl) urlsToDelete.push(data.musicUrl);

      // Filter only Firebase Storage URLs
      const firebaseStorageUrls = urlsToDelete.filter(url => 
        url && typeof url === 'string' && url.includes('firebasestorage')
      );

      // Delete files from Storage
      const deletePromises = firebaseStorageUrls.map(async (url) => {
        try {
          const fileRef = ref(storage, url);
          await deleteObject(fileRef);
        } catch (storageError) {
          console.warn(`Failed to delete file at ${url}:`, storageError);
          // Don't throw here, we still want to delete the main document or try other files
        }
      });

      await Promise.all(deletePromises);

      // Finally, delete the document
      await deleteDoc(inviteRef);
    }
  } catch (error) {
    console.error("Error deleting invitation and files:", error);
    throw error;
  }
};

export const cleanupStaleDrafts = async (): Promise<void> => {
  try {
    const invitationsRef = collection(db, 'invitations');
    // Fetch all draft invites
    const q = query(invitationsRef, where('status', '==', 'draft'));
    const querySnapshot = await getDocs(q);

    const now = new Date();
    const FIFTEEN_DAYS_IN_MS = 15 * 24 * 60 * 60 * 1000;

    const deletePromises: Promise<void>[] = [];

    querySnapshot.forEach((documentSnap) => {
      const data = documentSnap.data();
      // Assume missing createdAt means it's old/legacy or check if we can parse it
      let createdAtDate = null;
      if (data.createdAt) {
        createdAtDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      }
      
      if (createdAtDate) {
        const ageInMs = now.getTime() - createdAtDate.getTime();
        if (ageInMs > FIFTEEN_DAYS_IN_MS) {
          console.log(`Deleting stale draft ${documentSnap.id} (Age: ${Math.floor(ageInMs / (24*60*60*1000))} days)`);
          deletePromises.push(deleteInvitationAndFiles(documentSnap.id));
        }
      }
    });

    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(`Cleaned up ${deletePromises.length} stale drafts.`);
    }
  } catch (error) {
    console.error("Error cleaning up stale drafts:", error);
  }
};
