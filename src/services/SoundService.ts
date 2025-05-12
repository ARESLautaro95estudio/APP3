// Importamos los sonidos
// Nota: Deberás grabar estos sonidos y colocarlos en la carpeta assets/sounds/
import leftSound from '../assets/sounds/left.mp3';
import rightSound from '../assets/sounds/right.mp3';
import verticalSound from '../assets/sounds/vertical.mp3';
import horizontalSound from '../assets/sounds/horizontal.mp3';
import errorSound from '../assets/sounds/error.mp3';

// Enumeración de los tipos de sonidos disponibles
export enum SoundType {
  LEFT = 'left',
  RIGHT = 'right',
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  ERROR = 'error',
}

// Clase para manejar los sonidos
class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement>;
  private currentSound: HTMLAudioElement | null = null;

  constructor() {
    // Inicializamos el mapa de sonidos
    this.sounds = new Map<SoundType, HTMLAudioElement>();
    
    // Creamos y configuramos los elementos de audio
    this.sounds.set(SoundType.LEFT, new Audio(leftSound));
    this.sounds.set(SoundType.RIGHT, new Audio(rightSound));
    this.sounds.set(SoundType.VERTICAL, new Audio(verticalSound));
    this.sounds.set(SoundType.HORIZONTAL, new Audio(horizontalSound));
    this.sounds.set(SoundType.ERROR, new Audio(errorSound));
    
    // Configuramos cada sonido
    this.sounds.forEach((audio) => {
      // Precargar los sonidos
      audio.load();
      // Configurar para que se pueda reproducir en bucle si es necesario
      audio.loop = false;
    });
  }

  // Reproducir un sonido
  play(type: SoundType): void {
    // Detener cualquier sonido que esté reproduciéndose
    this.stopAll();
    
    // Obtener el sonido solicitado
    const audio = this.sounds.get(type);
    
    if (audio) {
      // Reiniciar el sonido
      audio.currentTime = 0;
      
      // Reproducir el sonido
      audio.play().catch((error) => {
        console.error('Error al reproducir sonido:', error);
      });
      
      // Guardar referencia al sonido actual
      this.currentSound = audio;
    }
  }

  // Detener todos los sonidos
  stopAll(): void {
    this.sounds.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    this.currentSound = null;
  }

  // Pausar el sonido actual
  pause(): void {
    if (this.currentSound) {
      this.currentSound.pause();
    }
  }

  // Reanudar el sonido actual
  resume(): void {
    if (this.currentSound) {
      this.currentSound.play().catch((error) => {
        console.error('Error al reanudar sonido:', error);
      });
    }
  }

  // Comprobar si hay algún sonido reproduciéndose
  isPlaying(): boolean {
    return !!this.currentSound && !this.currentSound.paused;
  }
}

// Crear y exportar una instancia única del servicio (patrón Singleton)
export const soundService = new SoundService();