import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonAlert,
  IonToast
} from '@ionic/react';
import PasswordModal from '../components/PasswordModal';
import './Home.css';

// Importamos los servicios simulados para la vibración y el flash
import { vibrate, toggleFlash } from '../services/MockNative';
import { playSound, SOUNDS, stopAllSounds } from '../services/SoundService';
import { saveLocalPassword, getLocalPassword, verifyLocalPassword } from '../services/AuthService';

const Home: React.FC = () => {
  // Estados para la aplicación
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Últimos valores de orientación
  const [lastBeta, setLastBeta] = useState(0);
  const [lastGamma, setLastGamma] = useState(0);
  
  // Umbral para detectar cambios en la orientación
  const orientationThreshold = 30;
  
  // Tiempo mínimo entre activaciones (para evitar disparos múltiples)
  const [lastTriggerTime, setLastTriggerTime] = useState(0);
  const triggerCooldown = 1000; // 1 segundo entre activaciones

  // Cuando la vista se carga
  useEffect(() => {
    // Verificar si ya hay una contraseña configurada
    const savedPassword = getLocalPassword();
    if (!savedPassword) {
      setIsInitialSetup(true);
      setShowPasswordModal(true);
    }
    
    // Configurar detección de orientación cuando la alarma está activa
    if (isAlarmActive) {
      console.log('Activando detección de orientación');
      window.addEventListener('deviceorientation', handleOrientationChange);
    } else {
      console.log('Desactivando detección de orientación');
      window.removeEventListener('deviceorientation', handleOrientationChange);
    }
    
    // Limpiar al desmontar
    return () => {
      window.removeEventListener('deviceorientation', handleOrientationChange);
    };
  }, [isAlarmActive]);

  // Manejar cambios de orientación
  const handleOrientationChange = (event: DeviceOrientationEvent) => {
    if (!isAlarmActive) return;
    
    // Obtener los valores de orientación
    const beta = event.beta || 0;  // Inclinación frontal/posterior (0° = plano)
    const gamma = event.gamma || 0; // Inclinación izquierda/derecha (0° = plano)
    
    // Calcular cambio en la orientación
    const betaChange = Math.abs(beta - lastBeta);
    const gammaChange = Math.abs(gamma - lastGamma);
    
    // Actualizar últimos valores
    setLastBeta(beta);
    setLastGamma(gamma);
    
    // Verificar si pasó suficiente tiempo desde la última activación
    const now = Date.now();
    if (now - lastTriggerTime < triggerCooldown) {
      return;
    }
    
    // Detectar orientación específica
    if (gammaChange > orientationThreshold) {
      // Movimiento a la izquierda
      if (gamma < -orientationThreshold) {
        console.log('Movimiento a la izquierda detectado');
        playSound(SOUNDS.LEFT);
        setLastTriggerTime(now);
      } 
      // Movimiento a la derecha
      else if (gamma > orientationThreshold) {
        console.log('Movimiento a la derecha detectado');
        playSound(SOUNDS.RIGHT);
        setLastTriggerTime(now);
      }
    }
    
    // Posición vertical (teléfono en pie)
    if (beta > 60 && Math.abs(gamma) < 30) {
      console.log('Posición vertical detectada');
      playSound(SOUNDS.VERTICAL);
      toggleFlash(true);
      setTimeout(() => toggleFlash(false), 5000);
      setLastTriggerTime(now);
    }
    
    // Posición horizontal pero boca abajo
    if (Math.abs(beta) > 150 || beta < -60) {
      console.log('Posición horizontal (boca abajo) detectada');
      playSound(SOUNDS.HORIZONTAL);
      vibrate(5000);
      setLastTriggerTime(now);
    }
  };

  // Activar la alarma
  const startAlarm = () => {
    try {
      setIsAlarmActive(true);
      
      // Mostramos un mensaje para fines de desarrollo
      console.log('Alarma activada. Mueve el dispositivo para probar.');
      setToastMessage('Alarma activada');
      setShowToast(true);
    } catch (error) {
      console.error('Error al iniciar la alarma:', error);
      setAlertMessage('No se pudo activar la alarma. Verifica los permisos del dispositivo.');
      setShowAlert(true);
      setIsAlarmActive(false);
    }
  };

  // Desactivar la alarma
  const stopAlarm = () => {
    setIsAlarmActive(false);
    stopAllSounds();
    toggleFlash(false);
    console.log('Alarma desactivada.');
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
      saveLocalPassword(enteredPassword);
      setIsInitialSetup(false);
      setShowPasswordModal(false);
      
      // Mostrar mensaje de éxito
      setToastMessage('Contraseña configurada correctamente');
      setShowToast(true);
      
      // Activar alarma automáticamente después de configurar la contraseña
      startAlarm();
    } else if (verifyLocalPassword(enteredPassword)) {
      // Contraseña correcta, desactivar alarma
      stopAlarm();
      setShowPasswordModal(false);
      
      setToastMessage('Alarma desactivada');
      setShowToast(true);
    } else {
      // Contraseña incorrecta - activar todos los efectos
      triggerAllAlerts();
      setShowPasswordModal(false);
      
      setToastMessage('¡Contraseña incorrecta!');
      setShowToast(true);
    }
  };

  // Activar todos los efectos al ingresar contraseña incorrecta
  const triggerAllAlerts = () => {
    playSound(SOUNDS.ERROR);
    vibrate(5000);
    toggleFlash(true);
    setTimeout(() => toggleFlash(false), 5000);
  };

  return (
    <IonPage placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonContent fullscreen placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
        
        {/* Toast para mensajes de confirmación */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;