import React, { useState } from 'react';
import {
  IonModal,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';
import './PasswordModal.css';

interface PasswordModalProps {
  isOpen: boolean;
  isInitialSetup: boolean;
  onVerify: (password: string) => void;
  onCancel: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  isInitialSetup,
  onVerify,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (isInitialSetup) {
      // Validar contraseña en la configuración inicial
      if (password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }
    
    onVerify(password);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleCancel} className="password-modal">
      <IonContent className="ion-padding">
        <h2 className="ion-text-center">
          {isInitialSetup ? 'Configura tu contraseña' : 'Ingresa tu contraseña'}
        </h2>
        
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          
          {isInitialSetup && (
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="floating">Confirmar contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonChange={(e) => setConfirmPassword(e.detail.value || '')}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          )}
          
          {error && (
            <IonRow>
              <IonCol>
                <IonText color="danger">
                  <p className="ion-text-center">{error}</p>
                </IonText>
              </IonCol>
            </IonRow>
          )}
          
          <IonRow className="ion-margin-top">
            <IonCol>
              <IonButton expand="block" onClick={handleVerify}>
                {isInitialSetup ? 'Configurar' : 'Verificar'}
              </IonButton>
            </IonCol>
          </IonRow>
          
          {!isInitialSetup && (
            <IonRow>
              <IonCol>
                <IonButton expand="block" fill="outline" color="medium" onClick={handleCancel}>
                  Cancelar
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default PasswordModal;