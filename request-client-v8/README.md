# request-client-v8

App Ionic/Angular con Capacitor (Android).

## Requisitos

- Node.js 20+
- npm
- Android Studio (para compilar APK)

## Ejecutar en web (desarrollo)

```bash
npm install
npm start
```

Esto levanta el servidor de desarrollo de Angular.

## Flujo Android con Capacitor

Desde la carpeta del proyecto:

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Notas:
- `npm run build` genera los assets web que Capacitor copia al proyecto nativo.
- `npx cap sync android` actualiza `android/` con cambios de web y plugins.
- `npx cap open android` abre el proyecto en Android Studio.

## Generar APK

En Android Studio:
- `Build > Build APK(s)`

Ruta habitual del APK:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`
