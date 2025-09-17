# Dashboard Bolsa Docents - Lleida

Sistema de gestión de nombramientos para docentes desarrollado por **@CarlesMiranda**.

## 🚀 Despliegue en Firebase

### Prerrequisitos

1. **Node.js** instalado en tu sistema
2. **Cuenta de Firebase** (https://firebase.google.com/)
3. **Firebase CLI** instalado globalmente:
   ```bash
   npm install -g firebase-tools
   ```

### Configuración del Proyecto Firebase

1. **Crear proyecto en Firebase Console:**
   - Ir a https://console.firebase.google.com/
   - Hacer clic en "Crear proyecto"
   - Seguir los pasos del asistente

2. **Habilitar servicios necesarios:**
   - **Authentication**: Habilitar "Acceso anónimo"
   - **Firestore Database**: Crear base de datos en modo "Producción"
   - **Hosting**: Habilitar Firebase Hosting

3. **Obtener configuración del proyecto:**
   - En la consola de Firebase, ir a "Configuración del proyecto"
   - En la sección "Tus apps", agregar una app web
   - Copiar la configuración que se muestra

### Configuración Local

1. **Actualizar firebase-config.js:**
   ```javascript
   const firebaseConfig = {
     apiKey: "tu-api-key-aquí",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-project-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "tu-app-id"
   };
   ```

2. **Inicializar Firebase en el directorio del proyecto:**
   ```bash
   cd /home/cmiranda/Escritorio/nomenament
   firebase login
   firebase init
   ```

3. **Durante la inicialización, seleccionar:**
   - ✅ Firestore: Configure rules and indexes files
   - ✅ Hosting: Configure files for Firebase Hosting
   - Usar archivos existentes cuando pregunte
   - **NO** sobrescribir los archivos existentes

### Despliegue

1. **Construir y desplegar:**
   ```bash
   firebase deploy
   ```

2. **Solo desplegar hosting (después del primer despliegue):**
   ```bash
   firebase deploy --only hosting
   ```

3. **Solo actualizar reglas de Firestore:**
   ```bash
   firebase deploy --only firestore:rules
   ```

### URLs del Proyecto

Después del despliegue exitoso, tu aplicación estará disponible en:
- **Hosting**: `https://tu-project-id.web.app/`
- **Consola Firebase**: `https://console.firebase.google.com/project/tu-project-id`

## 📁 Estructura del Proyecto

```
nomenament/
├── index.html              # Aplicación principal
├── app.js                  # Lógica de la aplicación
├── style.css               # Estilos CSS
├── firebase-config.js      # Configuración de Firebase
├── firebase.json           # Configuración de hosting y Firestore
├── firestore.rules         # Reglas de seguridad de Firestore
├── firestore.indexes.json  # Índices de Firestore
└── README.md               # Este archivo
```

## 🔧 Funcionalidades

- ✅ **Sistema de autenticación**: Acceso seguro con credenciales
- ✅ **Gestión de nombramientos**: Añadir, editar y eliminar nombramientos
- ✅ **Gestión de especialidades**: Crear y modificar especialidades
- ✅ **Análisis de datos**: Estimaciones de tiempo y análisis de ritmo
- ✅ **Sincronización en la nube**: Datos almacenados en Firestore
- ✅ **Offline-first**: Funciona sin conexión usando localStorage como respaldo
- ✅ **Responsive**: Diseño adaptativo para móviles y escritorio

## 🔐 Credenciales de Acceso

**Usuario**: `Sefirot70` o `sefirot70` (no distingue mayúsculas)
**Contraseña**: `Absa1234`

- La sesión permanece activa durante 8 horas
- Funciona perfectamente en dispositivos móviles
- Botón de logout disponible en el dashboard

## 🔒 Seguridad

- **Autenticación anónima**: Cada usuario tiene un ID único
- **Reglas de Firestore**: Solo el propietario puede acceder a sus datos
- **Datos privados**: Cada usuario solo ve sus propios nombramientos

## 🛠️ Comandos Útiles

```bash
# Ver logs de Firebase
firebase serve --only hosting

# Ejecutar emuladores locales
firebase emulators:start

# Ver información del proyecto
firebase projects:list

# Cambiar proyecto activo
firebase use tu-project-id
```

## 📱 Migración de Datos

Si ya tienes datos en localStorage, la aplicación los migrará automáticamente a Firebase la primera vez que se conecte.

## 🐛 Resolución de Problemas

1. **Error de CORS**: Asegúrate de que el dominio esté autorizado en Firebase Console
2. **Reglas de Firestore**: Verifica que las reglas permitan acceso anónimo
3. **Configuración**: Confirma que todas las claves en firebase-config.js son correctas

## 📞 Soporte

Desarrollado por **@CarlesMiranda** - Septiembre 2025

Para soporte o consultas, contactar al desarrollador.
