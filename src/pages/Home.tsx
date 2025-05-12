oring = () => {
    // En una implementación real:
    // DeviceMotion.removeAllListeners();
    
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    
    if (isActivated) {
      setToastMessage('Detector de robo desactivado');
      setShowToast(true);
    }
  };
  // Manejar la activación/desactivación de la alarma
  const handleToggleActivation = () => {
    if (!isActivated) {
      // Activar: pedir contraseña
      setShowPasswordModal(true);
    } else {
      // Desactivar: verificar contraseña
      setShowPasswordModal(true);
    }
  };
  
  const handleToggleActivation = () => {
    if (!isActivated) {
      // Activar: pedir contraseña
      setShowPasswordModal(true);
    } else {
      // Desactivar: verificar contraseña
      setShowPasswordModal(true);
    }
  };
  
  // Guardar la contraseña en Firebase y activar la alarma
  const handleSetPassword = async () => {
    if (!isActivated && userId && enteredPassword) {
      try {
        setIsLoading(true);
        
        // Guardar contraseña en Firebase
        await firebaseService.saveDevicePassword(userId, enteredPassword);
        
        // Guardar contraseña localmente y activar
        setPassword(enteredPassword);
        setEnteredPassword('');
        setShowPasswordModal(false);
        setIsActivated(true);
      } catch (error) {
        console.error('Error al guardar contraseña:', error);
        showToastMessage('Error al guardar contraseña');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Verificar contraseña para desactivar la alarma
  const handleVerifyPassword = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si la contraseña coincide con la almacenada
      if (enteredPassword === password) {
        // Contraseña correcta
        setEnteredPassword('');
        setShowPasswordModal(false);
        setIsActivated(false);
      } else {
        // Contraseña incorrecta
        setEnteredPassword('');
        setShowPasswordModal(false);
        
        // Disparar alarma completa
        triggerFullAlarm();
      }
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      showToastMessage('Error al verificar contraseña');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <IonPage>
      <IonContent className="ion-no-padding">
        <div className="full-height">
          <IonButton 
            expand="full" 
            size="large" 
            color={isActivated ? "danger" : "primary"}
            className="alarm-button"
            onClick={handleToggleActivation}
          >
            {isActivated ? "DESACTIVAR ALARMA" : "ACTIVAR ALARMA"}
          </IonButton>
        </div>
        
        {/* Modal para introducir/verificar contraseña */}
        <IonAlert
          isOpen={showPasswordModal}
          onDidDismiss={() => setShowPasswordModal(false)}
          header={isActivated ? 'Ingrese la contraseña para desactivar' : 'Configure la contraseña'}
          inputs={[
            {
              name: 'password',
              type: 'password',
              placeholder: isActivated ? 'Contraseña' : 'Nueva contraseña',
              handler: (e) => setEnteredPassword(e.target.value)
            }
          ]}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setEnteredPassword('');
                setShowPasswordModal(false);
              }
            },
            {
              text: isActivated ? 'Verificar' : 'Guardar',
              handler: () => {
                if (isActivated) {
                  handleVerifyPassword();
                } else {
                  handleSetPassword();
                }
              }
            }
          ]}
        />
        
        {/* Toast para mostrar mensajes */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
        
        {/* Loading para operaciones asíncronas */}
        <IonLoading
          isOpen={isLoading}
          message="Por favor espere..."
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;