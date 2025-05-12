// MockNative.ts
// Este archivo proporciona implementaciones simuladas de funciones nativas
// para desarrollo y pruebas en navegador

// Estado para simular la vibración y la linterna
let isVibratingState = false;
let flashActive = false;

// Elemento visual para simular flash (se añade al DOM cuando se activa)
let flashElement: HTMLDivElement | null = null;

// Inicializar el elemento de simulación de flash
const initFlashElement = () => {
  if (flashElement) return;
  
  flashElement = document.createElement('div');
  flashElement.style.position = 'fixed';
  flashElement.style.top = '0';
  flashElement.style.left = '0';
  flashElement.style.width = '100%';
  flashElement.style.height = '100%';
  flashElement.style.backgroundColor = 'white';
  flashElement.style.opacity = '0';
  flashElement.style.pointerEvents = 'none';
  flashElement.style.zIndex = '9999';
  flashElement.style.transition = 'opacity 0.2s ease-in-out';
  
  document.body.appendChild(flashElement);
};

// Simular la vibración del dispositivo
export const vibrate = (duration: number = 1000) => {
  if (isVibratingState) return;
  
  console.log(`Vibración simulada: ${duration}ms`);
  isVibratingState = true;
  
  // Intentar usar la API nativa de vibración
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (error) {
      console.error('Error al usar vibración:', error);
    }
  } else {
    console.log('Vibración no soportada en este dispositivo/navegador');
    
    // Simulación visual (parpadeo de la pantalla)
    let count = 0;
    const interval = setInterval(() => {
      if (count >= duration / 500) {
        clearInterval(interval);
        isVibratingState = false;
        return;
      }
      
      // Parpadeo visual
      const body = document.body;
      body.style.backgroundColor = count % 2 === 0 ? '#ffcccc' : '';
      
      count++;
    }, 250);
    
    // Restaurar después de la duración
    setTimeout(() => {
      document.body.style.backgroundColor = '';
      isVibratingState = false;
    }, duration);
  }
};

// Simulación/control de la linterna
export const toggleFlash = (state: boolean) => {
  // Si está en el mismo estado, no hacer nada
  if (state === flashActive) return;
  
  flashActive = state;
  console.log(`Linterna simulada: ${state ? 'ENCENDIDA' : 'APAGADA'}`);
  
  // En un navegador, simular el flash con un overlay blanco
  if (typeof document !== 'undefined') {
    // Inicializar el elemento de flash si no existe
    if (!flashElement) {
      initFlashElement();
    }
    
    // Actualizar la opacidad
    if (flashElement) {
      flashElement.style.opacity = state ? '0.9' : '0';
    }
  }
  
  // En un dispositivo real, usaríamos Capacitor o Cordova
  /*
  import { Plugins } from '@capacitor/core';
  const { Flashlight } = Plugins;
  
  try {
    await Flashlight.toggle(state);
  } catch (error) {
    console.error('Error al controlar la linterna:', error);
  }
  */
};

// Verificar si la linterna está activa
export const isFlashActive = (): boolean => {
  return flashActive;
};

// Verificar si está vibrando
export const isVibrating = (): boolean => {
  return isVibratingState;
};

// Limpiar recursos cuando ya no se necesitan
export const cleanup = () => {
  if (flashElement && flashElement.parentNode) {
    flashElement.parentNode.removeChild(flashElement);
    flashElement = null;
  }
  
  isVibratingState = false;
  flashActive = false;
};