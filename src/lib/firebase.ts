import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Configuración 
const firebaseConfig = {
  apiKey: "AIzaSyDUUOq1tC55glGr45dLo8T2nuD_-ELLWXc",
  authDomain: "app-l-m-primer-etapa.firebaseapp.com",
  projectId: "app-l-m-primer-etapa",
  storageBucket: "app-l-m-primer-etapa.firebasestorage.app",
  messagingSenderId: "632233436576",
  appId: "1:632233436576:web:e49ad8a9122701b38430c5",
  measurementId: "G-6P8GLWGBY8"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para iniciar sesión anónima
export const signInAnon = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    
    console.error('Error al iniciar sesión anónima:', error);
    throw error;
  }
};

// Guardar contraseña en Firestore
export const savePassword = async (userId: string, password: string) => {
  try {
    // En una aplicación real deberías hashear la contraseña
    await setDoc(doc(db, 'users', userId), {
      password: password,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error al guardar contraseña:', error);
    throw error;
  }
};

// Obtener contraseña de Firestore
export const getPassword = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().password;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener contraseña:', error);
    throw error;
  }
};

export { auth, db };