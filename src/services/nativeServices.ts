import { Haptics } from '@capacitor/haptics';
import { Flashlight } from '@capacitor/flashlight';
import { DeviceMotion, DeviceMotionAccelerationData } from '@capacitor/device-motion';

// Verificar disponibilidad de sensores
export const checkSensorsAvailability = async () => {
  try {
    // Verificar disponibilidad de linterna
    const isFlashlightAvailable = await Flashlight.available();
    
    // No hay un método específico para verificar otros sensores,
    // así que probamos con una medición única
    const hasMotionSensors = await testMotionSensors();
    
    return {
      flashlight: isFlashlightAvailable,
      motionSensors: hasMotionSensors,
    };
  } catch (error) {
    console.error('Error al verificar sensores:', error);
    return {
      flashlight: false,
      motionSensors: false
    };
  }
};

// Probar sensores de movimiento
const testMotionSensors = async () => {
  try {
    await DeviceMotion.requestPermissions();
    // Intentar obtener una medición
    const acceleration = await DeviceMotion.getCurrentAcceleration();
    return acceleration !== null;
  } catch (error) {
    console.error('Error al probar sensor de movimiento:', error);
    return false;
  }
};

// Activar vibración por duración específica
export const vibrateDevice = async (durationMs = 5000) => {
  try {
    // Primer pulso de vibración
    await Haptics.vibrate();
    
    // Creamos un intervalo para continuar vibrando
    const interval = setInterval(async () => {
      await Haptics.vibrate();
    }, 500); // Vibrar cada 500ms
    
    // Detener después de la duración especificada
    setTimeout(() => {
      clearInterval(interval);
    }, durationMs);
    
    return true;
  } catch (error) {
    console.error('Error al vibrar dispositivo:', error);
    return false;
  }
};

// Controlar la linterna
export const toggleLight = async (on: boolean, durationMs?: number) => {
  try {
    await Flashlight.toggle(on);
    
    // Si se proporciona una duración, apagar después de ese tiempo
    if (on && durationMs) {
      setTimeout(async () => {
        await Flashlight.toggle(false);
      }, durationMs);
    }
    
    return true;
  } catch (error) {
    console.error('Error al controlar linterna:', error);
    return false;
  }
};

// Iniciar observación de movimiento
export const startMotionWatch = async (
  callback: (acceleration: DeviceMotionAccelerationData) => void, 
  frequency = 500
) => {
  try {
    await DeviceMotion.requestPermissions();
    return DeviceMotion.watchAcceleration(
      { frequency },
      callback
    );
  } catch (error) {
    console.error('Error al iniciar observación de movimiento:', error);
    throw error;
  }
};

// Detener observación de movimiento
export const stopMotionWatch = async () => {
  try {
    await DeviceMotion.removeAllListeners();
    return true;
  } catch (error) {
    console.error('Error al detener observación de movimiento:', error);
    return false;
  }
};