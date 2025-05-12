import { Capacitor, Plugins } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { Device } from '@capacitor/device';

// Interfaz para el evento de acelerómetro
export interface AccelerometerEvent {
  x: number;
  y: number;
  z: number;
}

// Interfaz para los callbacks de acelerómetro
export interface AccelerometerCallback {
  (data: AccelerometerEvent): void;
}

class CapacitorDeviceHelper {
  private accelerometerInterval: any = null;
  private isVibrating: boolean = false;
  
  constructor() {}

  /**
   * Comprueba si el dispositivo es físico o un emulador
   */
  async isRealDevice(): Promise<boolean> {
    const info = await Device.getInfo();
    return !info.isVirtual;
  }

  /**
   * Activa el acelerómetro y devuelve datos periódicamente
   * @param callback Función que recibirá los datos del acelerómetro
   * @param frequency Frecuencia de actualización en milisegundos
   */
  startAccelerometer(callback: AccelerometerCallback, frequency: number = 500): Promise<void> {
    return new Promise((resolve, reject) => {
      // Detener cualquier instancia previa
      this.stopAccelerometer();
      
      try {
        // En dispositivos reales, podríamos usar DeviceMotionEvent para obtener datos de acelerómetro
        if (window.DeviceMotionEvent !== undefined) {
          // Para iOS necesitamos pedir permiso
          if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
              .then(permissionState => {
                if (permissionState === 'granted') {
                  this.setupDeviceMotionListener(callback, frequency);
                  resolve();
                } else {
                  reject(new Error('Permiso de acelerómetro denegado'));
                }
              })
              .catch(error => {
                reject(error);
              });
          } else {
            // Para Android y navegadores que no requieren permiso
            this.setupDeviceMotionListener(callback, frequency);
            resolve();
          }
        } else {
          // Fallback: generar datos sintéticos para pruebas
          console.warn('DeviceMotionEvent no disponible, usando datos sintéticos');
          this.setupSyntheticMotionData(callback, frequency);
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Detiene el acelerómetro
   */
  stopAccelerometer(): void {
    if (this.accelerometerInterval) {
      clearInterval(this.accelerometerInterval);
      this.accelerometerInterval = null;
    }
    
    // Remover listener si existe
    window.removeEventListener('devicemotion', this.deviceMotionHandler);
  }

  /**
   * Hace vibrar el dispositivo por un tiempo específico
   * @param duration Duración en milisegundos
   * @param pattern Patrón de vibración (intervalos entre vibraciones)
   */
  async vibrate(duration: number = 5000, pattern: number = 500): Promise<void> {
    if (this.isVibrating) return;
    
    try {
      this.isVibrating = true;
      
      // Primer pulso de vibración
      await Haptics.vibrate();
      
      // Configurar vibración continua con intervalos
      let elapsedTime = 0;
      const interval = setInterval(async () => {
        await Haptics.vibrate();
        elapsedTime += pattern;
        
        if (elapsedTime >= duration) {
          clearInterval(interval);
          this.isVibrating = false;
        }
      }, pattern);
      
      // Asegurar que se detiene después del tiempo especificado
      setTimeout(() => {
        clearInterval(interval);
        this.isVibrating = false;
      }, duration);
      
    } catch (error) {
      console.error('Error al vibrar el dispositivo:', error);
      this.isVibrating = false;
      throw error;
    }
  }

  /**
   * Intenta usar la linterna del dispositivo
   * Nota: Esta es una solución alternativa ya que no tenemos acceso directo a la API de linterna en Capacitor 4
   * Esta implementación puede no funcionar en todos los dispositivos
   */
  async toggleFlashlight(enable: boolean): Promise<void> {
    try {
      // Intentar usar la API experimental para la linterna
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Si queremos apagar, liberamos cualquier stream anterior
        if (!enable && this.mediaStream) {
          this.mediaStream.getTracks().forEach(track => {
            track.stop();
          });
          this.mediaStream = null;
          return;
        }
        
        // Si queremos encender, solicitar acceso a la cámara con flash
        if (enable) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              // @ts-ignore - Esto es una propiedad no estándar, puede no funcionar en todos los dispositivos
              advanced: [{ torch: true }]
            }
          });
          
          // Guardar referencia al stream para poder apagarlo después
          this.mediaStream = stream;
          
          // Intentar activar la linterna si está disponible
          const track = stream.getVideoTracks()[0];
          if (track && track.getCapabilities && track.getCapabilities().torch) {
            await track.applyConstraints({
              advanced: [{ torch: true }]
            });
            console.log('Linterna activada');
          } else {
            console.warn('Linterna no disponible en este dispositivo');
            // Liberar el stream si no podemos usar la linterna
            stream.getTracks().forEach(t => t.stop());
            this.mediaStream = null;
          }
        }
      } else {
        console.warn('API getUserMedia no disponible');
      }
    } catch (error) {
      console.error('Error al controlar la linterna:', error);
      throw error;
    }
  }

  // Variables privadas
  private mediaStream: MediaStream | null = null;
  private deviceMotionHandler: any = null;

  // Métodos auxiliares privados
  private setupDeviceMotionListener(callback: AccelerometerCallback, frequency: number): void {
    // Crear una función que maneje los eventos de movimiento
    this.deviceMotionHandler = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        callback({
          x: x || 0,
          y: y || 0,
          z: z || 0
        });
      }
    };
    
    // Registrar el listener para eventos de movimiento
    window.addEventListener('devicemotion', this.deviceMotionHandler);
  }

  private setupSyntheticMotionData(callback: AccelerometerCallback, frequency: number): void {
    // Generar datos sintéticos para pruebas
    this.accelerometerInterval = setInterval(() => {
      // Simular movimiento aleatorio
      const x = (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 2;
      const z = (Math.random() * 9) + 1; // Simular gravedad
      
      callback({ x, y, z });
    }, frequency);
  }
}

// Exportar singleton
export const capacitorDeviceHelper = new CapacitorDeviceHelper();