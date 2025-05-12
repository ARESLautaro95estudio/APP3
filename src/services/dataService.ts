import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

// Define la interfaz de la tarea correctamente
export interface Task {
  id?: string;
  titulo: string;        // En español como se guarda en la BD
  descripcion: string;   // En español como se guarda en la BD
  completed: boolean;
  Fecha?: Date | null;   // "Fecha" con F mayúscula como se guarda en la BD
  userId: string;
  createdAt: Date;
}

// Crear una nueva tarea
export const createTask = async (task: Omit<Task, 'id' | 'userId' | 'createdAt'>, userId: string) => {
  try {
    // Mapeo exacto como se almacenará en la BD
    const taskData = {
      titulo: task.titulo,
      descripcion: task.descripcion,
      completed: task.completed || false,
      Fecha: task.Fecha ? Timestamp.fromDate(task.Fecha) : null,
      userId,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'tasks'), taskData);
    return {
      id: docRef.id,
      ...task,
      userId,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw error;
  }
};

// Obtener todas las tareas de un usuario
export const getTasks = async (userId: string) => {
  try {
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(tasksQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Mapeo de los campos con sus nombres exactos desde la BD
      return {
        id: doc.id,
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        completed: data.completed || false,
        Fecha: data.Fecha?.toDate() || null,
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Task;
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }
};

// Obtener una tarea específica
export const getTask = async (taskId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'tasks', taskId));
    
    if (!docSnap.exists()) {
      throw new Error(`Tarea con ID ${taskId} no encontrada`);
    }
    
    const data = docSnap.data();
    
    return {
      id: docSnap.id,
      titulo: data.titulo || '',
      descripcion: data.descripcion || '',
      completed: data.completed || false,
      Fecha: data.Fecha?.toDate() || null,
      userId: data.userId,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Task;
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    throw error;
  }
};

// Actualizar una tarea
export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const updatesToSave: Record<string, any> = {};
    
    // Manejo explícito para cada campo
    if (updates.titulo !== undefined) {
      updatesToSave.titulo = updates.titulo;
    }
    
    if (updates.descripcion !== undefined) {
      updatesToSave.descripcion = updates.descripcion;
    }
    
    if (updates.completed !== undefined) {
      updatesToSave.completed = updates.completed;
    }
    
    if (updates.Fecha !== undefined) {
      updatesToSave.Fecha = updates.Fecha ? Timestamp.fromDate(updates.Fecha) : null;
    }
    
    await updateDoc(doc(db, 'tasks', taskId), updatesToSave);
    
    // Obtener la tarea actualizada
    return getTask(taskId);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
};