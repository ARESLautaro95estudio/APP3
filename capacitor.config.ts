import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.antitheft',
  appName: 'Ionic Anti-Theft',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    // Configuración de permisos
    Permissions: {
      permissions: ['accelerometer', 'magnetometer', 'gyroscope']
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;