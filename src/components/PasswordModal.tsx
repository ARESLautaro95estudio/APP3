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
    <IonModal isOpen={isOpen} onDidDismiss={handleCancel} className="password-modal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <IonContent className="ion-padding" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <h2 className="ion-text-center">
          {isInitialSetup ? 'Configura tu contraseña' : 'Ingresa tu contraseña'}
        </h2>
        
        <IonGrid placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <IonRow placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <IonCol placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                />
              </IonItem>
            </IonCol>
          </IonRow>
          
          {isInitialSetup && (
            <IonRow placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonCol placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IonItem placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  <IonLabel position="floating" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirmar contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    onIonChange={(e) => setConfirmPassword(e.detail.value || '')} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
                </IonItem>
              </IonCol>
            </IonRow>
          )}
          
          {error && (
            <IonRow placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonCol placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IonText color="danger" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  <p className="ion-text-center">{error}</p>
                </IonText>
              </IonCol>
            </IonRow>
          )}
          
          <IonRow className="ion-margin-top" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <IonCol placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonButton expand="block" onClick={handleVerify} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {isInitialSetup ? 'Configurar' : 'Verificar'}
              </IonButton>
            </IonCol>
          </IonRow>
          
          {!isInitialSetup && (
            <IonRow placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <IonCol placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <IonButton expand="block" fill="outline" color="medium" onClick={handleCancel} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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