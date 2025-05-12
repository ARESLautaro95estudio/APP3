import { Motion, MotionEventResult } from '@capacitor/motion';

// Enumeración para los tipos de orientación
export enum OrientationType {
  NORMAL = 'normal',       // Posición inicial o de reposo
  LEFT = 'left',           // Inclinado hacia la izquierda
  RIGHT = 'right',         // Inclinado hacia la derecha
  VERTICAL = 'vertical',   // En posición vertical
  HORIZONTAL = 'horizontal' // En posición horizontal (pero no la inicial)
}

// Interfaz para los callbacks de orientación
export interface OrientationCallback {
  (orientation: OrientationType): void;
}

// Configuración para el servicio
interface OrientationConfig {
  threshold?: number;       // Umbral para detectar cambios significativos
  changeThreshold?: number; // Umbral para considerar un cambio en la orientación
  frequency?: number;       // Frecuencia de muestreo en milisegundos
}

class OrientationService {
  private isWatching: boolean = false;
  private lastOrientation: MotionEventResult = { accelerationIncludingGravity: { x: 0, y: 0, z: 0 } };
  private currentOrientation: OrientationType = OrientationType.NORMAL;
  private callback: OrientationCallback | null = null;
  private config: OrientationConfig = {
    threshold: 4.0,        // Umbral para detectar inclinación
    changeThreshold: 3.0,  // Umbral para detectar cambios
    frequency: 500         // Frecuencia de muestreo en ms
  };

  constructor(config?: OrientationConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  // Iniciar la detección de orientación
  async start(callback: OrientationCallback): Promise<void> {
    if (this.isWatching) {
      // Ya está iniciado, detener primero
      await this.stop();
    }

    this.callback = callback;

    try {
      // Solicitar permisos si es necesario
      await Motion.requestPermissions();
      
      // Iniciar la observación de movimiento
      await Motion.addListener('accel', this.handleMotionChange.bind(this));
      
      this.isWatching = true;
      return Promise.resolve();
    } catch (error) {
      console.error('Error al iniciar detección de orientación:', error);
      return Promise.reject(error);
    }
  }

  // Detener la detección de orientación
  async stop(): Promise<void> {
    if (this.isWatching) {
      try {
        await Motion.removeAllListeners();
        this.isWatching = false;
        this.callback = null;
        return Promise.resolve();
      } catch (error) {
        console.error('Error al detener detección de orientación:', error);
        return Promise.reject(error);
      }
    }
    return Promise.resolve();
  }

  // Manejar cambios en el movimiento
  private handleMotionChange(acceleration: MotionEventResult): void {
    // Al inicio del método handleMotionChange:
const threshold = this.config.threshold || 4.0;
const changeThreshold = this.config.changeThreshold || 3.0;
    if (!acceleration.accelerationIncludingGravity) return;
    
    const { x, y, z } = acceleration.accelerationIncludingGravity;
    const { threshold, changeThreshold } = this.config;
    
    // Verificar si hay un cambio significativo en la orientación
    const significantChange = 
      Math.abs(x - this.lastOrientation.accelerationIncludingGravity.x) > changeThreshold || 
      Math.abs(y - this.lastOrientation.accelerationIncludingGravity.y) > changeThreshold || 
      Math.abs(z - this.lastOrientation.accelerationIncludingGravity.z) > changeThreshold;
    
    if (significantChange) {
      // Actualizar última orientación
      this.lastOrientation = acceleration;
      
      // Determinar la orientación actual
      let newOrientation: OrientationType = OrientationType.NORMAL;
      
      if (Math.abs(x) > threshold) {
        if (x < -threshold) {
          newOrientation = OrientationType.LEFT;
        } else if (x > threshold) {
          newOrientation = OrientationType.RIGHT;
        }
      } else if (Math.abs(y) > threshold) {
        if (y > threshold) {
          newOrientation = OrientationType.VERTICAL;
        }
      } else if (Math.abs(z) > threshold) {
        if (z > threshold) {
          newOrientation = OrientationType.HORIZONTAL;
        }
      }
      
      // Si la orientación ha cambiado, notificar al callback
      if (newOrientation !== this.currentOrientation) {
        this.currentOrientation = newOrientation;
        
        if (this.callback) {
          this.callback(newOrientation);
        }
      }
    }
  }
}

// Crear y exportar una instancia única del servicio
export const orientationService = new OrientationService();