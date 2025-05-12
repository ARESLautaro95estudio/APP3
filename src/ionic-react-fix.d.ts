import * as React from 'react';

declare module '@ionic/react' {
  export interface IonRouterOutletProps extends React.HTMLAttributes<HTMLElement> {
    placeholder?: boolean;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }
  
  // Agrega todas las interfaces que necesites aquí
}