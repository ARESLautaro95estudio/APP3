import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.antitheft',
  appName: 'Ionic Anti-Theft',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    Haptics: {
      vibrate: true
    },
    DeviceMotion: {
      enable: true
    },
    Flashlight: {
      enable: true
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;