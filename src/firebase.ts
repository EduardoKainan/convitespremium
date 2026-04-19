import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { User } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

export const saveUserToDb = async (user: User) => {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create user document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: user.email === 'eduardokainan.senai@gmail.com' ? 'admin' : 'user',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    } else {
      // Update last login
      await setDoc(userRef, { 
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName || userSnap.data().displayName,
        photoURL: user.photoURL || userSnap.data().photoURL,
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error saving user to DB:", error);
  }
};
