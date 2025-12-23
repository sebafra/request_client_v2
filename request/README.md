# Request Ionic App

## Development Environment

```bash
# Start development server
docker-compose -f docker-compose.dev.yml up --build
```

The app will be available at http://localhost:8100

## Build Android APK

```bash
# Start build container
docker-compose -f docker-compose.build.yml up -d --build

# Enter container and build APK
docker exec -it request_ionic_build bash

# Inside container:
ionic cordova platform add android
ionic cordova build android

# The APK will be at: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Notas importantes para builds Android en Docker (Mac M1/M2, ARM, x86_64)

### 1. Forzar arquitectura x86_64 (amd64) en Docker Compose

Asegúrate de que tu archivo `docker-compose.build.yml` incluya la línea:

```
platform: linux/amd64
```

en el servicio que construye la app. Esto es necesario para que los Android Build Tools funcionen correctamente en Mac M1/M2.

### 2. Edición manual de build.gradle (CordovaLib)

Después de ejecutar `ionic cordova platform add android`, edita el archivo:

```
platforms/android/CordovaLib/build.gradle
```

Y realiza estos cambios:
- Elimina la línea:
  ```groovy
  classpath 'com.jfrog.bintray.gradle:gradle-bintray-plugin:1.7.3'
  ```
- Elimina la línea:
  ```groovy
  apply plugin: 'com.jfrog.bintray'
  ```
- Elimina todo el bloque que comienza con:
  ```groovy
  bintray {
    ...
  }
  ```

Esto es necesario porque el plugin de bintray ya no está disponible y puede causar errores de compilación.

## Stop Containers

```bash
# Stop development
docker-compose -f docker-compose.dev.yml down

# Stop build
docker-compose -f docker-compose.build.yml down
```