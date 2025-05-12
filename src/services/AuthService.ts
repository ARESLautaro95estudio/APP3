// AuthService.ts - Servicio para autenticación
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Interfaz para el resultado de autenticación
interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Iniciar sesión con correo y contraseña
export const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al iniciar sesión'
    };
  }
};

// Registrar un nuevo usuario
export const registerWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al registrar usuario'
    };
  }
};

// Cerrar sesión
export const logout = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
};

// Obtener el usuario actual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Escuchar cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: User | null) => void): () => void => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  
  return unsubscribe;
};

// Para simplificar el desarrollo, también podemos incluir un login básico local
// que no dependa de Firebase, usando localStorage

// Guardar contraseña localmente
export const saveLocalPassword = (password: string): void => {
  localStorage.setItem('app_password', password);
};

// Obtener contraseña local
export const getLocalPassword = (): string | null => {
  return localStorage.getItem('app_password');
};

// Verificar contraseña local
export const verifyLocalPassword = (password: string): boolean => {
  const savedPassword = getLocalPassword();
  return savedPassword === password;
};