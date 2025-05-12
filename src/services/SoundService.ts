// SoundService.ts
// Este servicio maneja la reproducción de sonidos para la aplicación

// Define los tipos de sonidos disponibles
export const SOUNDS = {
  LEFT: 'left',
  RIGHT: 'right',
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  ERROR: 'error'
};

// Mapeo de sonidos a mensajes (para alertas de fallback)
const soundMessages = {
  [SOUNDS.LEFT]: "¡Están hurtando el dispositivo!",
  [SOUNDS.RIGHT]: "¡Epa! ¿Qué estás por hacer?",
  [SOUNDS.VERTICAL]: "¡Alarma activada! Posición vertical.",
  [SOUNDS.HORIZONTAL]: "¡Alarma activada! Posición horizontal.",
  [SOUNDS.ERROR]: "¡Contraseña incorrecta! Alarma activada."
};

// Mapa de instancias de Audio para cada sonido
const audioInstances: { [key: string]: HTMLAudioElement } = {};

// Mensajes adicionales para debugging
const debugMessages = {
  [SOUNDS.LEFT]: "Movimiento a la izquierda detectado",
  [SOUNDS.RIGHT]: "Movimiento a la derecha detectado", 
  [SOUNDS.VERTICAL]: "Posición vertical detectada",
  [SOUNDS.HORIZONTAL]: "Posición horizontal detectada",
  [SOUNDS.ERROR]: "Contraseña incorrecta"
};

// Estados para evitar reproducción múltiple
let isPlaying = false;
let currentSound: string | null = null;

// Función para inicializar el servicio de sonido
export const initSoundService = () => {
  // Para una implementación real, deberías usar archivos de audio reales
  try {
    // Crear elementos de audio y precargarlos
    Object.keys(SOUNDS).forEach(key => {
      const soundKey = key as keyof typeof SOUNDS;
      const soundName = SOUNDS[soundKey];
      
      // En una implementación real, usarías rutas reales
      const soundPath = `assets/sounds/${soundName}.mp3`;
      
      // Crear elemento de audio
      const audio = new Audio();
      audio.preload = 'auto';
      
      // En un proyecto real, establecer la fuente
      // audio.src = soundPath;
      
      // Almacenar instancia
      audioInstances[soundName] = audio;
    });
    
    console.log('Servicio de sonido inicializado');
  } catch (error) {
    console.error('Error al inicializar el servicio de sonido:', error);
  }
};

// Función para reproducir un sonido
export const playSound = (soundType: string) => {
  // Evitar reproducción múltiple
  if (isPlaying) {
    return;
  }
  
  // Marcar como reproduciendo
  isPlaying = true;
  currentSound = soundType;
  
  // Mostrar mensaje de debugging
  console.log(`Reproduciendo sonido: ${soundType}`);
  if (debugMessages[soundType]) {
    console.log(debugMessages[soundType]);
  }
  
  // Para una implementación real, reproducir el sonido
  try {
    // Verificar si hay un mensaje asociado
    if (soundMessages[soundType]) {
      // Para desarrollo: mostrar una alerta con el mensaje
      alert(soundMessages[soundType]);
    }
    
    // En una implementación real:
    /*
    if (audioInstances[soundType]) {
      // Reproducir el sonido
      audioInstances[soundType].currentTime = 0;
      audioInstances[soundType].play()
        .then(() => {
          // Configurar evento para cuando termine
          audioInstances[soundType].onended = () => {
            isPlaying = false;
            currentSound = null;
          };
        })
        .catch(error => {
          console.error('Error al reproducir sonido:', error);
          isPlaying = false;
          currentSound = null;
        });
    }
    */
    
    // Para simulación, desactivar después de un tiempo
    setTimeout(() => {
      isPlaying = false;
      currentSound = null;
    }, 1000);
    
  } catch (error) {
    console.error('Error al reproducir sonido:', error);
    isPlaying = false;
    currentSound = null;
  }
};

// Función para detener todos los sonidos
export const stopAllSounds = () => {
  try {
    // Detener el sonido actual
    if (currentSound && audioInstances[currentSound]) {
      audioInstances[currentSound].pause();
      audioInstances[currentSound].currentTime = 0;
    }
    
    // Reiniciar estados
    isPlaying = false;
    currentSound = null;
    
    console.log('Todos los sonidos detenidos');
  } catch (error) {
    console.error('Error al detener sonidos:', error);
  }
};

// Función para verificar si hay algún sonido reproduciéndose
export const isSoundPlaying = (): boolean => {
  return isPlaying;
};

// Inicializar el servicio
initSoundService();