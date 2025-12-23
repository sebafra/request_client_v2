FROM --platform=linux/amd64 node:10-buster

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gradle \
    wget \
    unzip \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Instalar Java 8 desde Adoptium (Temurin)
RUN cd /tmp && \
    wget https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u412-b08/OpenJDK8U-jdk_x64_linux_hotspot_8u412b08.tar.gz && \
    tar -xzf OpenJDK8U-jdk_x64_linux_hotspot_8u412b08.tar.gz && \
    mv jdk8u412-b08 /usr/lib/jvm/java-8-adoptium && \
    rm OpenJDK8U-jdk_x64_linux_hotspot_8u412b08.tar.gz

ENV JAVA_HOME /usr/lib/jvm/java-8-adoptium
ENV PATH $JAVA_HOME/bin:$PATH
RUN echo "export JAVA_HOME=/usr/lib/jvm/java-8-adoptium" >> /root/.bashrc
RUN echo "export PATH=/usr/lib/jvm/java-8-adoptium/bin:\$PATH" >> /root/.bashrc

# Configurar variables de entorno para Android
ENV ANDROID_HOME /opt/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools

# Descargar e instalar Android SDK
RUN mkdir -p ${ANDROID_HOME} && \
    cd ${ANDROID_HOME} && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip -O sdk.zip && \
    unzip sdk.zip && \
    rm sdk.zip

# Aceptar licencias y instalar componentes necesarios
RUN yes | ${ANDROID_HOME}/cmdline-tools/bin/sdkmanager --sdk_root=${ANDROID_HOME} --licenses && \
    ${ANDROID_HOME}/cmdline-tools/bin/sdkmanager --sdk_root=${ANDROID_HOME} \
    "platform-tools" \
    "platforms;android-28" \
    "build-tools;28.0.3"

# Instalar dependencias globales de Ionic y Cordova
RUN npm install -g ionic@3.20.0 cordova@7.1.0

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY ionic.config.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código
COPY . .

# Puerto que usa Ionic por defecto
EXPOSE 8100

# Mantener el contenedor corriendo
CMD ["tail", "-f", "/dev/null"]