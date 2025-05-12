import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonAlert,
  useIonViewDidEnter,
  useIonViewDidLeave
} from '@ionic/react';
import { Haptics } from '@capacitor/haptics';
import { Flashlight } from '@capacitor/flashlight';

import PasswordModal from '../components/PasswordModal';
import { orientationService, OrientationType } from '../services/OrientationService';
import { soundService, SoundType } from '../services/SoundService';
import './Home.css';

const Home: React.FC = () => {
  // Estados para la aplicación
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Estado para tracking de actividad
  const [lastActivity, setLastActivity] = useState<OrientationType | null>(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  // Cuando la vista se carga
  useIonViewDidEnter(() => {
    // Verificar disponibilidad de funciones nativas
    checkNativeCapabilities();
    
    // Mostrar configuración inicial
    if (isInitialSetup) {
      setShowPasswordModal(true);
    }
  });

  // Cuando la vista se descarga
  useIonViewDidLeave(() => {
    // Asegurarnos de detener la detección al salir
    if (isAlarmActive) {
      stopAlarm();
    }
  });

  // Verificar capacidades nativas
  const checkNativeCapabilities = async () => {
    try {
      // Verificar disponibilidad de linterna
      const flashlightAvailable = await Flashlight.available();
      
      if (!flashlightAvailable) {
        console.warn('Linterna no disponible en este dispositivo');
      }
    } catch (error) {
      console.error('Error al verificar capacidades nativas:', error);
    }
  };

  // Manejar el cambio de orientación
  const handleOrientationChange = (orientation: OrientationType) => {
    if (!isAlarmActive) return;
    
    // Evitar activar el mismo efecto múltiples veces
    if (orientation === lastActivity) return;
    
    setLastActivity(orientation);
    
    switch (orientation) {
      case OrientationType.LEFT:
        soundService.play(SoundType.LEFT);
        break;
      case OrientationType.RIGHT:
        soundService.play(SoundType.RIGHT);
        break;
      case OrientationType.VERTICAL:
        soundService.play(SoundType.VERTICAL);
        toggleFlashlight(true);
        setTimeout(() => toggleFlashlight(false), 5000);
        break;
      case OrientationType.HORIZONTAL:
        soundService.play(SoundType.HORIZONTAL);
        triggerVibration();
        break;
      default:
        // Posición normal, no hacemos nada
        break;
    }
  };

  // Activar/desactivar linterna
  const toggleFlashlight = async (state: boolean) => {
    try {
      if (state && !isFlashlightOn) {
        await Flashlight.toggle(true);
        setIsFlashlightOn(true);
      } else if (!state && isFlashlightOn) {
        await Flashlight.toggle(false);
        setIsFlashlightOn(false);
      }
    } catch (error) {
      console.error('Error al controlar linterna:', error);
    }
  };

  // Activar vibración
  const triggerVibration = async () => {
    if (isVibrating) return;
    
    try {
      setIsVibrating(true);
      
      // Primer pulso de vibración
      await Haptics.vibrate();
      
      // Crear un intervalo para vibración continua
      const interval = setInterval(async () => {
        await Haptics.vibrate();
      }, 500);
      
      // Detener después de 5 segundos
      setTimeout(() => {
        clearInterval(interval);
        setIsVibrating(false);
      }, 5000);
    } catch (error) {
      console.error('Error al vibrar:', error);
      setIsVibrating(false);
    }
  };

  // Activar todos los efectos de alarma (contraseña incorrecta)
  const triggerAllAlerts = () => {
    soundService.play(SoundType.ERROR);
    triggerVibration();
    toggleFlashlight(true);
    setTimeout(() => toggleFlashlight(false), 5000);
  };

  // Activar la alarma
  const startAlarm = async () => {
    try {
      setIsAlarmActive(true);
      
      // Iniciar detección de orientación
      await orientationService.start(handleOrientationChange);
    } catch (error) {
      console.error('Error al iniciar la alarma:', error);
      setAlertMessage('No se pudo activar la alarma. Verifica los permisos del dispositivo.');
      setShowAlert(true);
      setIsAlarmActive(false);
    }
  };

  // Desactivar la alarma
  const stopAlarm = async () => {
    try {
      setIsAlarmActive(false);
      
      // Detener detección de orientación
      await orientationService.stop();
      
      // Detener sonidos
      soundService.stopAll();
      
      // Asegurarnos de que la linterna está apagada
      await toggleFlashlight(false);
    } catch (error) {
      console.error('Error al detener la alarma:', error);
    }
  };

  // Manejar el clic en el botón principal
  const handleButtonClick = () => {
    if (isInitialSetup) {
      // Primera vez, mostrar configuración de contraseña
      setShowPasswordModal(true);
    } else if (!isAlarmActive) {
      // Activar alarma
      startAlarm();
    } else {
      // Desactivar alarma (pedir contraseña)
      setShowPasswordModal(true);
    }
  };

  // Manejar la verificación de contraseña
  const handlePasswordVerify = (enteredPassword: string) => {
    if (isInitialSetup) {
      // Guardar contraseña inicial
      setPassword(enteredPassword);
      setIsInitialSetup(false);
      setShowPasswordModal(false);
      
      // Activar alarma automáticamente después de configurar la contraseña
      startAlarm();
    } else if (enteredPassword === password) {
      // Contraseña correcta, desactivar alarma
      stopAlarm();
      setShowPasswordModal(false);
    } else {
      // Contraseña incorrecta - activar todos los efectos
      triggerAllAlerts();
      setShowPasswordModal(false);
    }
  };

  // Limpiar recursos al desmontar el componente
  useEffect(() => {
    return () => {
      // Detener detección de orientación
      orientationService.stop();
      
      // Detener sonidos
      soundService.stopAll();
      
      // Apagar linterna
      toggleFlashlight(false);
    };
  }, []);

  return (
    <IonPage placeholder="">
      <IonContent fullscreen placeholder="">
        <div 
          className={`alarm-button ${isAlarmActive ? 'active' : 'inactive'}`}
          onClick={handleButtonClick}
        >
          <h1>{isAlarmActive ? 'ALARMA ACTIVADA' : 'ACTIVAR ALARMA'}</h1>
          <p>{isAlarmActive ? 'Toca para desactivar' : 'Toca para activar'}</p>
        </div>

        {/* Modal para ingresar contraseña */}
        <PasswordModal
          isOpen={showPasswordModal}
          isInitialSetup={isInitialSetup}
          onVerify={handlePasswordVerify}
          onCancel={() => setShowPasswordModal(false)}
        />

        {/* Alerta para errores */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Alerta"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;