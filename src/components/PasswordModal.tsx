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
  IonText,
  InputChangeEventDetail
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
    <IonModal isOpen={isOpen} onDidDismiss={handleCancel} className="password-modal" placeholder="">
      <IonContent className="ion-padding" placeholder="">
        <h2 className="ion-text-center">
          {isInitialSetup ? 'Configura tu contraseña' : 'Ingresa tu contraseña'}
        </h2>
        
        <IonGrid placeholder="">
          <IonRow placeholder="">
            <IonCol placeholder="">
              <IonItem placeholder="">
                <IonLabel position="floating" placeholder="">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e: CustomEvent<InputChangeEventDetail>) => setPassword(e.detail.value || '')}
                  placeholder=""
                />
              </IonItem>
            </IonCol>
          </IonRow>
          
          {isInitialSetup && (
            <IonRow placeholder="">
              <IonCol placeholder="">
                <IonItem placeholder="">
                  <IonLabel position="floating" placeholder="">Confirmar contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => setConfirmPassword(e.detail.value || '')}
                    placeholder=""
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          )}
          
          {error && (
            <IonRow placeholder="">
              <IonCol placeholder="">
                <IonText color="danger" placeholder="">
                  <p className="ion-text-center">{error}</p>
                </IonText>
              </IonCol>
            </IonRow>
          )}
          
          <IonRow className="ion-margin-top" placeholder="">
            <IonCol placeholder="">
              <IonButton expand="block" onClick={handleVerify} placeholder="">
                {isInitialSetup ? 'Configurar' : 'Verificar'}
              </IonButton>
            </IonCol>
          </IonRow>
          
          {!isInitialSetup && (
            <IonRow placeholder="">
              <IonCol placeholder="">
                <IonButton expand="block" fill="outline" color="medium" onClick={handleCancel} placeholder="">
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