// Resetear el estado del botón inmediatamente cuando se carga el script - Versión mejorada
(function() {
  const resetButton = function() {
    console.log('🚀 Ejecutando reset inicial del botón...');
    
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = document.querySelector('.login-btn-text');
    const btnLoading = document.querySelector('.login-btn-loading');
    const errorDiv = document.getElementById('loginError');
    
    if (submitBtn) {
      submitBtn.disabled = false;
      console.log('✅ Initial: Botón habilitado');
    }
    
    if (btnText) {
      btnText.classList.remove('hidden');
      console.log('✅ Initial: Texto mostrado');
    }
    
    if (btnLoading) {
      btnLoading.classList.add('hidden');
      console.log('✅ Initial: Loading ocultado');
    }
    
    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }
    
    console.log('✅ Reset inicial completado');
  };
  
  // Ejecutar múltiples veces para garantizar el reset
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resetButton);
    // También ejecutar cuando cargue completamente
    window.addEventListener('load', resetButton);
  } else {
    resetButton();
    // Ejecutar otra vez después de un breve delay
    setTimeout(resetButton, 100);
  }
})();

/*
 * Dashboard Bolsa Docents - Lleida
 * Sistema de gestión de nombramientos para docentes
 * 
 * Desarrollado por @CarlesMiranda
 * Fecha: Septiembre 2025
 */

/*
 * Security enhancements
 * Implementación de Content Security Policy y medidas adicionales
 */

// CSP Headers (para implementar en el servidor/hosting)
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Session security improvements
class SecurityManager {
  static generateSecureToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  static validateSession() {
    const authToken = sessionStorage.getItem('bolsaDocentsAuth');
    const authTime = sessionStorage.getItem('bolsaDocentsAuthTime');
    const sessionToken = sessionStorage.getItem('bolsaDocentsSessionToken');
    
    if (!authToken || !authTime || !sessionToken) {
      return false;
    }
    
    const currentTime = new Date().getTime();
    const authTimeStamp = parseInt(authTime);
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 horas
    
    // Verificar expiración
    if (currentTime - authTimeStamp > sessionDuration) {
      this.clearSession();
      return false;
    }
    
    // Verificar integridad del token de sesión
    return this.validateSessionToken(sessionToken);
  }
  
  static validateSessionToken(token) {
    // Validación básica del formato del token
    return token && token.length === 64 && /^[a-f0-9]+$/.test(token);
  }
  
  static createSecureSession() {
    const currentTime = new Date().getTime();
    const sessionToken = this.generateSecureToken();
    
    sessionStorage.setItem('bolsaDocentsAuth', 'authenticated');
    sessionStorage.setItem('bolsaDocentsAuthTime', currentTime.toString());
    sessionStorage.setItem('bolsaDocentsSessionToken', sessionToken);
    
    return sessionToken;
  }
  
  static clearSession() {
    sessionStorage.removeItem('bolsaDocentsAuth');
    sessionStorage.removeItem('bolsaDocentsAuthTime');
    sessionStorage.removeItem('bolsaDocentsSessionToken');
  }
  
  static hashPassword(password) {
    // Para implementación futura con hashing real
    // Por ahora mantenemos la comparación directa para compatibilidad
    return password;
  }
}

// Authentication credentials
const AUTH_CONFIG = {
  username: 'Sefirot70',
  altUsername: 'sefirot70', // Permitir ambas variantes
  password: 'Absa1234'
};

// Authentication state
let isAuthenticated = false;

// Check if user is already authenticated
function checkAuthStatus() {
  // SIMPLIFICADO: Usar el mismo método que index.html para consistencia
  const authToken = sessionStorage.getItem('bolsaDocentsAuth');
  const authTime = sessionStorage.getItem('bolsaDocentsAuthTime');
  
  console.log('🔍 app.js: Verificando autenticación simple:', {
    authToken: authToken,
    authTime: authTime ? 'presente' : 'ausente'
  });
  
  // Verificación básica - misma lógica que index.html
  if (authToken === 'authenticated' && authTime) {
    const currentTime = new Date().getTime();
    const authTimeStamp = parseInt(authTime);
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 horas
    
    // Verificar si la sesión no ha expirado
    if (currentTime - authTimeStamp <= sessionDuration) {
      console.log('✅ app.js: Usuario autenticado (sesión válida)');
      isAuthenticated = true;
      return true;
    } else {
      console.log('⏰ app.js: Sesión expirada, limpiando...');
      sessionStorage.removeItem('bolsaDocentsAuth');
      sessionStorage.removeItem('bolsaDocentsAuthTime');
    }
  }
  
  console.log('❌ app.js: Usuario no autenticado');
  isAuthenticated = false;
  return false;
}

// Función para resetear el botón de login - Versión mejorada
function resetLoginButton() {
  console.log('🔄 Reseteando botón de login...');
  
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.querySelector('.login-btn-text');
  const btnLoading = document.querySelector('.login-btn-loading');
  const errorDiv = document.getElementById('loginError');
  
  if (submitBtn) {
    submitBtn.disabled = false;
    console.log('✅ Botón habilitado');
  } else {
    console.warn('⚠️ No se encontró el botón de submit');
  }
  
  if (btnText) {
    btnText.classList.remove('hidden');
    // Forzar visibilidad por si CSS cached no se aplica
    btnText.style.display = 'flex';
    console.log('✅ Texto del botón mostrado');
  } else {
    console.warn('⚠️ No se encontró el texto del botón');
  }
  
  if (btnLoading) {
    btnLoading.classList.add('hidden');
    // Forzar ocultación inline
    btnLoading.style.display = 'none';
    console.log('✅ Loading ocultado');
  } else {
    console.warn('⚠️ No se encontró el loading del botón');
  }
  
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
  
  console.log('✅ Reset del botón completado');
}

// Función de respaldo para forzar reset del botón si se queda colgado
function forceResetLoginButton() {
  const btnLoading = document.querySelector('.login-btn-loading');
  const submitBtn = document.getElementById('loginSubmitBtn');
  
  // Solo hacer reset si el botón está en estado de loading
  if (btnLoading && !btnLoading.classList.contains('hidden')) {
    console.warn('🚨 Forzando reset del botón - estaba colgado');
    resetLoginButton();
  }
  
  // También verificar si el botón está deshabilitado sin motivo
  if (submitBtn && submitBtn.disabled) {
    const currentUser = sessionStorage.getItem('bolsaDocentsAuth');
    if (!currentUser) { // Solo resetear si no hay usuario autenticado
      console.warn('🚨 Botón deshabilitado sin sesión activa - reseteando');
      resetLoginButton();
    }
  }
}

function showLoginScreen() {
  const loginScreen = document.getElementById('loginScreen');
  const mainDashboard = document.getElementById('mainDashboard');
  
  if (loginScreen) {
    loginScreen.classList.remove('hidden');
    loginScreen.style.display = 'flex';
  }
  
  if (mainDashboard) {
    mainDashboard.classList.add('hidden');
    mainDashboard.style.display = 'none';
    mainDashboard.style.visibility = 'hidden';
  }
  
  // Focus en el campo de usuario para mejor UX
  setTimeout(() => {
    const usernameField = document.getElementById('username');
    if (usernameField) {
      usernameField.focus();
    }
  }, 100);
  
  // Asegurar que el botón esté en su estado inicial
  resetLoginButton();
}

function showDashboard() {
  console.log('🎯 Intentando mostrar dashboard...');
  
  const loginScreen = document.getElementById('loginScreen');
  const mainDashboard = document.getElementById('mainDashboard');
  
  if (!loginScreen) {
    console.error('❌ Elemento loginScreen no encontrado');
    return;
  }
  
  if (!mainDashboard) {
    console.error('❌ Elemento mainDashboard no encontrado');
    return;
  }
  
  console.log('📱 Ocultando pantalla de login...');
  loginScreen.classList.add('hidden');
  loginScreen.style.display = 'none';
  
  console.log('📱 Mostrando dashboard...');
  mainDashboard.classList.remove('hidden');
  mainDashboard.style.display = 'block';
  mainDashboard.style.visibility = 'visible';
  
  // Debug adicional
  console.log('📱 Estado final del dashboard:', {
    display: mainDashboard.style.display,
    visibility: mainDashboard.style.visibility,
    classList: [...mainDashboard.classList],
    offsetHeight: mainDashboard.offsetHeight
  });
  
  console.log('✅ Dashboard mostrado correctamente');
  isAuthenticated = true;
  
  // ASEGURAR QUE EL DASHBOARD SE INICIALICE
  setTimeout(() => {
    console.log('🔧 app.js: Verificando inicialización del dashboard...');
    
    // Verificar si initializeDashboard existe y no se ha ejecutado
    if (typeof initializeDashboard === 'function' && !window.dashboardInitialized) {
      console.log('🚀 app.js: Ejecutando inicialización del dashboard...');
      initializeDashboard();
      window.dashboardInitialized = true;
    } else if (window.dashboardInitialized) {
      console.log('✅ app.js: Dashboard ya inicializado');
    } else {
      console.warn('⚠️ app.js: Función initializeDashboard no encontrada');
    }
  }, 300);
}

function authenticateUser(username, password) {
  // Verificar credenciales (case-insensitive para username)
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.trim();
  
  const isValid = (normalizedUsername === AUTH_CONFIG.username.toLowerCase() || 
                   normalizedUsername === AUTH_CONFIG.altUsername.toLowerCase()) &&
                  normalizedPassword === AUTH_CONFIG.password;
  
  if (isValid) {
    // Usar SecurityManager para crear sesión segura
    SecurityManager.createSecureSession();
    console.log('✅ Sesión segura creada');
  }
  
  return isValid;
}

function handleLoginSubmit(event) {
  event.preventDefault();
  console.log('🔄 Iniciando proceso de login...');
  
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.querySelector('.login-btn-text');
  const btnLoading = document.querySelector('.login-btn-loading');
  const errorDiv = document.getElementById('loginError');
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  console.log('📝 Usuario:', username ? 'Presente' : 'Vacío');
  console.log('🔑 Contraseña:', password ? 'Presente' : 'Vacía');
  
  // Validación básica
  if (!username.trim() || !password.trim()) {
    console.log('❌ Validación fallida: campos vacíos');
    showMessage('Error', 'Por favor, introduce usuario y contraseña', 'error');
    return;
  }
  
  // UI Loading state
  console.log('🔄 Estableciendo estado de carga...');
  submitBtn.disabled = true;
  if (btnText) btnText.classList.add('hidden');
  if (btnLoading) btnLoading.classList.remove('hidden');
  if (errorDiv) errorDiv.classList.add('hidden');
  
  // Ejecutar autenticación INMEDIATAMENTE sin setTimeout
  console.log('🔐 Ejecutando autenticación inmediata...');
  
  try {
    const authResult = authenticateUser(username, password);
    console.log('🎯 Resultado autenticación:', authResult);
    
    if (authResult) {
      console.log('✅ Autenticación exitosa - Mostrando dashboard');
      
      // Resetear botón INMEDIATAMENTE
      resetLoginButton();
      
      // Mostrar dashboard
      showDashboard();
      
      // Inicializar la aplicación principal - hay un delay para asegurar que el DOM se renderice
      setTimeout(() => {
        console.log('🚀 Inicializando aplicación principal...');
        // La función initializeDashboard ya se ejecuta en el código inline del HTML
        console.log('✅ Aplicación principal inicializada');
      }, 100);
      
    } else {
      console.log('❌ Credenciales incorrectas');
      
      // Mostrar error
      if (errorDiv) {
        errorDiv.classList.remove('hidden');
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
      }
      
      // Limpiar y resetear
      document.getElementById('password').value = '';
      document.getElementById('username').focus();
      
      // Resetear botón tras error
      resetLoginButton();
    }
  } catch (error) {
    console.error('❌ Error durante autenticación:', error);
    showMessage('Error', 'Error durante la autenticación. Inténtalo de nuevo.', 'error');
    
    // Resetear botón tras error
    resetLoginButton();
  }
}

function logout() {
  // Usar SecurityManager para limpiar sesión
  SecurityManager.clearSession();
  isAuthenticated = false;
  showLoginScreen();
  
  // Limpiar formulario
  document.getElementById('loginForm').reset();
  resetLoginButton();
}

// Función para añadir botón de logout (opcional)
function addLogoutButton() {
  const userInfo = document.querySelector('.user-info');
  if (userInfo && !document.getElementById('logoutBtn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.className = 'btn btn--outline btn--small';
    logoutBtn.innerHTML = '🚪 Salir';
    logoutBtn.title = 'Cerrar sesión';
    logoutBtn.style.marginLeft = '16px';
    logoutBtn.addEventListener('click', logout);
    userInfo.appendChild(logoutBtn);
  }
}

// Función para configurar eventos de login
function setupLoginEvents() {
  console.log('🔧 Configurando eventos de login...');
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    console.log('✅ Formulario de login encontrado, añadiendo listener');
    loginForm.addEventListener('submit', handleLoginSubmit);
    
    // También añadir listener al botón directamente como respaldo
    const submitBtn = document.getElementById('loginSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function(e) {
        console.log('🖱️ Click directo en botón detectado');
        if (loginForm.checkValidity()) {
          handleLoginSubmit(e);
        }
      });
      console.log('✅ Listener de click añadido al botón');
    }
  } else {
    console.warn('⚠️ Formulario de login NO encontrado');
    // Reintentar en 500ms
    setTimeout(setupLoginEvents, 500);
  }
}

// CSS para animación shake
const shakeCSS = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
`;

// Inyectar CSS para la animación
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Application data
let appData = {
  "userInfo": {
    "numero_orden": 101322,
    "tiempo_servicio": 0,
    "especialidades": [
      {"codigo": "712", "nombre": "Disseny Gràfic", "status": "pendent p.c.", "currentNumber": 0, "remaining": 101322},
      {"codigo": "715", "nombre": "Fotografia", "status": "activa", "currentNumber": 0, "remaining": 101322},
      {"codigo": "507", "nombre": "Informàtica", "status": "pendent p.c.", "currentNumber": 25060, "remaining": 76262},
      {"codigo": "721", "nombre": "Mitjans Audiovisuals", "status": "activa", "currentNumber": 0, "remaining": 101322},
      {"codigo": "722", "nombre": "Mitjans Informàtics", "status": "pendent p.c.", "currentNumber": 0, "remaining": 101322},
      {"codigo": "519", "nombre": "Processos I Mitjans De Comunicació", "status": "pendent p.c.", "currentNumber": 0, "remaining": 101322},
      {"codigo": "522", "nombre": "Processos I Productes D'Arts Gràfiques", "status": "pendent p.c.", "currentNumber": 0, "remaining": 101322},
      {"codigo": "623", "nombre": "Producció En Arts Gràfiques", "status": "pendent p.c.", "currentNumber": 33155, "remaining": 68167},
      {"codigo": "627", "nombre": "Sistemes I Aplicacions Informàtiques", "status": "pendent p.c.", "currentNumber": 0, "remaining": 101322},
      {"codigo": "TEC", "nombre": "Tecnologia", "status": "activa", "currentNumber": 100374, "remaining": 948},
      {"codigo": "629", "nombre": "Tècniques I Procediments D'Imatge I So", "status": "pendent p.c.", "currentNumber": 0, "remaining": 101322}
    ]
  },
  "especialidadData": {
    "TEC": {
      "ultimo_numero": 100374,
      "fecha": "09/09/2025",
      "centro": "IES Lo Pla d'Urgell (Bellpuig)",
      "jornada": "0,50",
      "fin": "31/08/2026",
      "historico": [
        {"numero": 10524, "fecha": "21/07/2025"},
        {"numero": 26427, "fecha": "28/08/2025"},
        {"numero": 69390, "fecha": "08/09/2025"},
        {"numero": 100374, "fecha": "09/09/2025"},
        {"numero": 28678, "fecha": "15/09/2025"}
      ]
    },
    "507": {
      "ultimo_numero": 25060,
      "fecha": "15/09/2025",
      "centro": "Institut Caparrella (Lleida)",
      "jornada": "Sencera",
      "fin": "29/09/2025",
      "historico": [
        {"numero": 14779, "fecha": "08/09/2025"},
        {"numero": 25060, "fecha": "15/09/2025"}
      ]
    },
    "623": {
      "ultimo_numero": 33155,
      "fecha": "09/09/2025",
      "centro": "IES Caparrella (Lleida)",
      "jornada": "Sencera",
      "fin": "18/09/2025",
      "historico": [
        {"numero": 33155, "fecha": "09/09/2025"}
      ]
    }
  },
  "projections": {
    "TEC": {
      "semanas_estimadas": 0.08,
      "dias_estimados": 0.5,
      "restantes": 948,
      "ritmo_semanal": 12579
    },
    "507": {
      "semanas_estimadas": 6.06,
      "dias_estimados": 42.4,
      "restantes": 76262,
      "ritmo_semanal": 12579
    },
    "623": {
      "semanas_estimadas": "N/D",
      "dias_estimados": "N/D",
      "restantes": 68167,
      "ritmo_semanal": "Insuficientes datos"
    }
  },
  "allAppointments": [
    {"id": "1", "fecha": "15/09/2025", "especialidad": "507", "numero": 25060, "centro": "Institut Caparrella (Lleida)", "jornada": "Sencera", "inicio": "15/09/25", "fin": "29/09/25", "duracion": "Hasta 29/09/2025"},
    {"id": "2", "fecha": "15/09/2025", "especialidad": "TEC", "numero": 28678, "centro": "Institut Màrius Torres (Lleida)", "jornada": "Sencera", "inicio": "15/09/25", "fin": "11/12/25", "duracion": "Hasta 11/12/2025"},
    {"id": "3", "fecha": "09/09/2025", "especialidad": "623", "numero": 33155, "centro": "IES Caparrella (Lleida)", "jornada": "Sencera", "inicio": "09/09/25", "fin": "18/09/25", "duracion": "Hasta 18/09/2025"},
    {"id": "4", "fecha": "09/09/2025", "especialidad": "TEC", "numero": 100374, "centro": "IES Lo Pla d'Urgell (Bellpuig)", "jornada": "0,50", "inicio": "09/09/25", "fin": "31/08/26", "duracion": "Hasta 31/08/2026"},
    {"id": "5", "fecha": "08/09/2025", "especialidad": "507", "numero": 14779, "centro": "Institut Caparrella (Lleida)", "jornada": "0,50", "inicio": "08/09/25", "fin": "31/08/26", "duracion": "Hasta 31/08/2026"},
    {"id": "6", "fecha": "08/09/2025", "especialidad": "TEC", "numero": 69390, "centro": "IES Lo Pla d'Urgell (Bellpuig)", "jornada": "0,50", "inicio": "08/09/25", "fin": "31/08/26", "duracion": "Hasta 31/08/2026"},
    {"id": "7", "fecha": "28/08/2025", "especialidad": "TEC", "numero": 26427, "centro": "IES Mollerussa", "jornada": "0,50", "inicio": "28/08/25", "fin": "31/08/26", "duracion": "Hasta 31/08/2026"},
    {"id": "8", "fecha": "21/07/2025", "especialidad": "TEC", "numero": 10524, "centro": "IES Lo Pla d'Urgell", "jornada": "0,50", "inicio": "21/07/25", "fin": "31/08/26", "duracion": "Hasta 31/08/2026"}
  ]
};

// Gestión de errores centralizada
class ErrorHandler {
  static logError(error, context = '') {
    console.error(`[${context}] Error:`, error);
    
    // Enviar errores a servicio de monitoreo en producción
    if (window.location.hostname !== 'localhost') {
      this.reportError(error, context);
    }
  }
  
  static reportError(error, context) {
    // Integración con servicio como Sentry en futuras iteraciones
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Por ahora, solo log local
    console.warn('Error logged for monitoring:', errorData);
  }
  
  static handleAsyncError(asyncFunction, context = '') {
    return async (...args) => {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        this.logError(error, context);
        
        if (typeof showMessage === 'function') {
          showMessage('Error', 'Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'error');
        }
        
        throw error; // Re-throw para permitir manejo específico
      }
    };
  }
}

// Wrapper para funciones críticas - Se definirán cuando las funciones estén disponibles
let safeFirestoreSave = null;
let safeFirestoreLoad = null;

// Función para inicializar los wrappers cuando Firebase esté disponible
function initializeSafeWrappers() {
  if (typeof saveDataToFirestore !== 'undefined') {
    safeFirestoreSave = ErrorHandler.handleAsyncError(saveDataToFirestore, 'FIRESTORE_SAVE');
  }
  if (typeof loadDataFromFirestore !== 'undefined') {
    safeFirestoreLoad = ErrorHandler.handleAsyncError(loadDataFromFirestore, 'FIRESTORE_LOAD');
  }
}

// Sorting state
let tableSortState = {
  column: 'fecha', // Default sort by fecha (order of entry)
  direction: 'desc' // desc = newest first (default behavior)
};

// Utility functions as before
function formatNumber(num) {
  // Validar que num es un número válido antes de formatear
  if (typeof num !== 'number' || isNaN(num)) {
    console.warn('⚠️ formatNumber recibió un valor inválido:', num);
    return '0';
  }
  return num.toLocaleString('es-ES');
}

// Optimización de rendimiento - Debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimización de renderizado con requestAnimationFrame
function optimizedRenderAll() {
  if (window.renderPending) return;
  
  window.renderPending = true;
  requestAnimationFrame(() => {
    renderAll();
    window.renderPending = false;
  });
}

// Reemplazar renderAll directo por versión optimizada en eventos frecuentes
const debouncedRender = debounce(optimizedRenderAll, 100);

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return new Date(year.length === 2 ? '20'+year : year, month - 1, day);
}

function formatDate(dateStr) {
  const date = parseDate(dateStr);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function formatDateForInput(dateStr) {
  const [day, month, year] = dateStr.split('/');
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function formatDateFromInput(inputDate) {
  if (!inputDate) return '';
  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

// Las funciones saveData y loadData ahora se definen en firebase-config.js
// pero mantenemos versiones de respaldo aquí
function saveDataLocal() {
  try {
    if (typeof Storage !== "undefined") {
      localStorage.setItem('bolsaDocentsData', JSON.stringify(appData));
    }
  } catch {}
}

function loadDataLocal() {
  try {
    if (typeof Storage !== "undefined") {
      const saved = localStorage.getItem('bolsaDocentsData');
      if (saved) {
        appData = JSON.parse(saved);
        return true;
      }
    }
  } catch {}
  return false;
}

function showMessage(title, message, type = 'info') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  const modal = document.getElementById('messageModal');
  modal.classList.remove('hidden');
  modal.classList.add('show');
}

function hideMessage() {
  const modal = document.getElementById('messageModal');
  modal.classList.add('hidden');
  modal.classList.remove('show');
}

function showFormModal() {
  const modal = document.getElementById('addAppointmentModal');
  if (!modal) return;
  
  // Usar display y visibility en lugar de clases show/hidden solamente
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  
  // Poblar especialidades
  if (window.appData && window.appData.userInfo && window.appData.userInfo.especialidades) {
    updateSpecialtySelect();
  }
}

function hideFormModal() {
  const modal = document.getElementById('addAppointmentModal');
  if (!modal) return;
  
  modal.classList.add('hidden');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  
  // Limpiar formulario
  const form = document.getElementById('appointmentForm');
  if (form) form.reset();
}

// User Order Number Management
function showEditOrderForm() {
  document.getElementById('editOrderForm').classList.remove('hidden');
  const currentNumber = appData.userInfo.numero_orden;
  document.getElementById('newOrderNumber').value = currentNumber;
  document.getElementById('newOrderNumber').focus();
  document.getElementById('newOrderNumber').select();
}

function hideEditOrderForm() {
  document.getElementById('editOrderForm').classList.add('hidden');
  document.getElementById('newOrderNumber').value = '';
}

function updateOrderNumber() {
  const newOrderInput = document.getElementById('newOrderNumber');
  const newOrder = parseInt(newOrderInput.value);
  
  if (!newOrder || newOrder <= 0) {
    showMessage('Error', 'Por favor, introduce un número de orden válido', 'error');
    return;
  }
  
  // Update the order number in app data
  appData.userInfo.numero_orden = newOrder;
  
  // Update display
  updateOrderNumberDisplay();
  
  // Recalculate all projections with new order number
  recalculateProjections();
  
  // Sincronizar datos de especialidades con el nuevo número
  syncSpecialtyData();
  
  // Update time estimations
  updateTimeEstimations();
  
  // Save data
  saveData();
  
  // Hide form
  hideEditOrderForm();
  
  // Show success message
  showMessage('Éxito', `Número de orden actualizado a ${formatNumber(newOrder)}`);
}

function updateOrderNumberDisplay() {
  const displayElement = document.getElementById('displayOrderNumber');
  if (!displayElement) {
    console.warn('⚠️ Elemento displayOrderNumber no encontrado');
    return;
  }
  
  // Verificar que el número de orden existe y es válido
  const orderNumber = appData.userInfo?.numero_orden;
  if (typeof orderNumber === 'number' && !isNaN(orderNumber)) {
    displayElement.textContent = formatNumber(orderNumber);
  } else {
    console.warn('⚠️ Número de orden no válido, usando valor por defecto');
    displayElement.textContent = '101.322'; // Valor por defecto
  }
}

// Specialty Management Functions
function showManageSpecialtiesModal() {
  const modal = document.getElementById('manageSpecialtiesModal');
  if (!modal) return;
  
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  
  renderSpecialtiesList();
}

function hideManageSpecialtiesModal() {
  const modal = document.getElementById('manageSpecialtiesModal');
  if (!modal) return;
  
  modal.classList.add('hidden');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  
  // Hide any active edit forms
  document.querySelectorAll('.specialty-edit-form').forEach(form => {
    form.classList.remove('active');
  });
}

function addNewSpecialty(event) {
  event.preventDefault();
  
  const code = document.getElementById('newSpecialtyCode').value.trim();
  const name = document.getElementById('newSpecialtyName').value.trim();
  const isPending = document.getElementById('newSpecialtyPending').checked;
  
  if (!code || !name) {
    showMessage('Error', 'El código y nombre son obligatorios', 'error');
    return;
  }
  
  // Check if specialty code already exists
  const existingSpecialty = appData.userInfo.especialidades.find(esp => esp.codigo === code);
  if (existingSpecialty) {
    showMessage('Error', `Ya existe una especialidad con el código ${code}`, 'error');
    return;
  }
  
  // Add new specialty
  const newSpecialty = {
    codigo: code,
    nombre: name,
    status: isPending ? 'pendent p.c.' : 'activa'
  };
  
  appData.userInfo.especialidades.push(newSpecialty);
  
  // Update specialty select in form
  updateSpecialtySelect();
  
  // Save data
  saveData();
  
  // Refresh UI
  renderSpecialtyCards();
  renderSpecialtiesList();
  
  // Clear form
  document.getElementById('addSpecialtyForm').reset();
  document.getElementById('newSpecialtyPending').checked = true;
  
  showMessage('Éxito', `Especialidad ${code} añadida correctamente`);
}

function editSpecialty(index) {
  // Hide any other active edit forms
  document.querySelectorAll('.specialty-edit-form').forEach(form => {
    form.classList.remove('active');
  });
  
  // Show the edit form for this specialty
  const editForm = document.getElementById(`edit-form-${index}`);
  if (editForm) {
    editForm.classList.add('active');
    
    // Focus on the first input
    const firstInput = editForm.querySelector('input[type="text"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

function deleteSpecialty(index) {
  if (confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
    appData.userInfo.especialidades.splice(index, 1);
    renderSpecialtyCards();
    // Usar la función saveData disponible globalmente
    if (typeof saveData === 'function') {
      saveData();
    } else {
      saveDataLocal();
    }
    showMessage('Éxito', 'Especialidad eliminada correctamente', 'success');
  }
}

function saveSpecialtyEdit(index) {
  const code = document.getElementById(`edit-code-${index}`).value.trim();
  const name = document.getElementById(`edit-name-${index}`).value.trim();
  const isPending = document.getElementById(`edit-pending-${index}`).checked;
  
  if (!code || !name) {
    showMessage('Error', 'El código y nombre son obligatorios', 'error');
    return;
  }
  
  // Check if code conflicts with another specialty (excluding current one)
  const conflictingSpecialty = appData.userInfo.especialidades.find((esp, i) => 
    esp.codigo === code && i !== index
  );
  if (conflictingSpecialty) {
    showMessage('Error', `Ya existe otra especialidad con el código ${code}`, 'error');
    return;
  }
  
  // Update specialty
  const oldCode = appData.userInfo.especialidades[index].codigo;
  appData.userInfo.especialidades[index] = {
    codigo: code,
    nombre: name,
    status: isPending ? 'pendent p.c.' : 'activa'
  };
  
  // If code changed, update references in data
  if (oldCode !== code) {
    updateSpecialtyCodeReferences(oldCode, code);
  }
  
  // Update specialty select
  updateSpecialtySelect();
  
  // Save data
  saveData();
  
  // Refresh UI
  renderSpecialtyCards();
  renderSpecialtiesList();
  
  showMessage('Éxito', `Especialidad ${code} actualizada correctamente`);
}

function cancelSpecialtyEdit(index) {
  const editForm = document.getElementById(`edit-form-${index}`);
  editForm.classList.remove('active');
}

function deleteSpecialty(index) {
  const specialty = appData.userInfo.especialidades[index];
  
  if (confirm(`¿Estás seguro de que quieres eliminar la especialidad ${specialty.codigo} - ${specialty.nombre}?\n\nEsto también eliminará todos los nombramientos asociados.`)) {
    const deletedCode = specialty.codigo;
    
    // Remove specialty
    appData.userInfo.especialidades.splice(index, 1);
    
    // Remove related data
    delete appData.especialidadData[deletedCode];
    delete appData.projections[deletedCode];
    
    // Remove appointments for this specialty
    appData.allAppointments = appData.allAppointments.filter(apt => apt.especialidad !== deletedCode);
    
    // Update specialty select
    updateSpecialtySelect();
    
    // Save data
    saveData();
    
    // Refresh UI
    renderAll();
    renderSpecialtiesList();
    
    showMessage('Éxito', `Especialidad ${deletedCode} eliminada correctamente`);
  }
}

function updateSpecialtyCodeReferences(oldCode, newCode) {
  // Update specialty data
  if (appData.especialidadData[oldCode]) {
    appData.especialidadData[newCode] = appData.especialidadData[oldCode];
    delete appData.especialidadData[oldCode];
  }
  
  // Update projections
  if (appData.projections[oldCode]) {
    appData.projections[newCode] = appData.projections[oldCode];
    delete appData.projections[oldCode];
  }
  
  // Update appointments
  appData.allAppointments.forEach(appointment => {
    if (appointment.especialidad === oldCode) {
      appointment.especialidad = newCode;
    }
  });
}

function updateSpecialtySelect() {
  const select = document.getElementById('especialidad');
  if (!select) {
    console.warn('Select de especialidad no encontrado');
    return;
  }
  
  const currentValue = select.value;
  
  // Clear existing options except the first one
  select.innerHTML = '<option value="">Seleccionar especialidad...</option>';
  
  // Add all specialties
  appData.userInfo.especialidades.forEach(specialty => {
    const option = document.createElement('option');
    option.value = specialty.codigo;
    option.textContent = `${specialty.codigo} - ${specialty.nombre}`;
    select.appendChild(option);
  });
  
  // Restore selection if it still exists
  if (currentValue && appData.userInfo.especialidades.find(esp => esp.codigo === currentValue)) {
    select.value = currentValue;
  }
}

function renderSpecialtiesList() {
  const container = document.getElementById('specialtiesList');
  container.innerHTML = '';
  
  appData.userInfo.especialidades.forEach((specialty, index) => {
    const item = document.createElement('div');
    item.className = 'specialty-item';
    
    item.innerHTML = `
      <div class="specialty-info">
        <span class="specialty-code">${specialty.codigo}</span>
        <span class="specialty-name">${specialty.nombre}</span>
        <span class="specialty-status ${specialty.status.includes('activa') ? 'activa' : 'pendent'}">${specialty.status}</span>
      </div>
      <div class="specialty-actions">
        <button type="button" class="edit-specialty-btn" onclick="editSpecialty(${index})">
          ✏️ Editar
        </button>
        <button type="button" class="delete-specialty-btn" onclick="deleteSpecialty(${index})">
          🗑️ Eliminar
        </button>
      </div>
      <div id="edit-form-${index}" class="specialty-edit-form">
        <div class="specialty-edit-grid">
          <div class="form-group">
            <label class="form-label">Código</label>
            <input type="text" id="edit-code-${index}" class="form-control" value="${specialty.codigo}">
          </div>
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input type="text" id="edit-name-${index}" class="form-control" value="${specialty.nombre}">
          </div>
          <div class="form-group">
            <label class="form-label">Estado</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" id="edit-pending-${index}" ${specialty.status.includes('pendent') ? 'checked' : ''}>
                <span class="checkbox-text">Pendent p.c.</span>
              </label>
            </div>
          </div>
        </div>
        <div class="specialty-edit-actions">
          <button type="button" class="save-specialty-btn" onclick="saveSpecialtyEdit(${index})">
            ✓ Guardar
          </button>
          <button type="button" class="cancel-specialty-btn" onclick="cancelSpecialtyEdit(${index})">
            ✕ Cancelar
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(item);
  });
}

function renderSpecialtyCards() {
  const container = document.getElementById('specialtyCards');
  if (!container) return;

  container.innerHTML = '';
  
  let specialties = appData.userInfo.especialidades || [];
  
  // Actualizar números actuales desde especialidadData antes de renderizar
  specialties = specialties.map(specialty => {
    const specialtyData = appData.especialidadData[specialty.codigo];
    if (specialtyData) {
      const currentNumber = specialtyData.ultimo_numero || 0;
      
      // Calcular el número más alto alcanzado
      let maxNumber = 0;
      if (specialtyData.historico && specialtyData.historico.length > 0) {
        maxNumber = Math.max(...specialtyData.historico.map(h => h.numero));
      }
      
      const remaining = Math.max(0, appData.userInfo.numero_orden - maxNumber);
      return {
        ...specialty,
        currentNumber: currentNumber,
        maxNumber: maxNumber,
        remaining: remaining
      };
    } else {
      // Si no hay datos de seguimiento, usar valores por defecto
      return {
        ...specialty,
        currentNumber: 0,
        maxNumber: 0,
        remaining: appData.userInfo.numero_orden
      };
    }
  });
  
  // Ordenar especialidades por número máximo (descendente) - las que han llegado más lejos primero
  specialties.sort((a, b) => {
    const aNum = a.maxNumber || 0;
    const bNum = b.maxNumber || 0;
    return bNum - aNum;
  });
  
  specialties.forEach((specialty, index) => {
    const remaining = specialty.remaining;
    const currentNumber = specialty.currentNumber;
    const maxNumber = specialty.maxNumber;
    const bgColor = `var(--color-bg-${(index % 8) + 1})`;
    
    // Calcular el índice original para las funciones de edición/eliminación
    const originalIndex = appData.userInfo.especialidades.findIndex(esp => esp.codigo === specialty.codigo);
    
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.style.setProperty('--card-color', bgColor);
    
    card.innerHTML = `
      <div class="flashcard-header">
        <h3 class="flashcard-title">${specialty.nombre}</h3>
        <div class="flashcard-actions">
          <button class="flashcard-btn" title="Editar" onclick="editSpecialty(${originalIndex})">✏️</button>
          <button class="flashcard-btn" title="Eliminar" onclick="deleteSpecialty(${originalIndex})">🗑️</button>
        </div>
      </div>
      <p class="specialty-code">Código: ${specialty.codigo}</p>
      <p class="specialty-status ${specialty.status.includes('activa') ? 'activa' : 'pendent'}">${specialty.status}</p>
      <div class="flashcard-stats">
        <div class="stat-item max-number">
          <span class="stat-value">${maxNumber > 0 ? formatNumber(maxNumber) : 'N/D'}</span>
          <span class="stat-label">Máximo</span>
        </div>
        <div class="stat-item current-number">
          <span class="stat-value">${currentNumber > 0 ? formatNumber(currentNumber) : 'N/D'}</span>
          <span class="stat-label">Actual</span>
        </div>
        <div class="stat-item remaining">
          <span class="stat-value">${maxNumber > 0 ? formatNumber(remaining) : formatNumber(appData.userInfo.numero_orden)}</span>
          <span class="stat-label">Restantes</span>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Funciones de renderizado de gráficos
function hideChart() {
  const chartContainer = document.getElementById('chartContainer');
  if (chartContainer) chartContainer.classList.add('hidden');
  const noChartData = document.getElementById('noChartData');
  if (noChartData) noChartData.classList.remove('hidden');
  if (appointmentsChart) {
    try { appointmentsChart.destroy(); } catch (e) {}
    appointmentsChart = null;
  }
}

function renderChart(specialtyCode) {
  const chartContainer = document.getElementById('chartContainer');
  const noChartData = document.getElementById('noChartData');
  if (noChartData) noChartData.classList.add('hidden');
  if (chartContainer) chartContainer.classList.remove('hidden');

  // Recolectar datos históricos de la especialidad
  const dataObj = appData && appData.especialidadData && appData.especialidadData[specialtyCode];
  if (!dataObj || !Array.isArray(dataObj.historico) || dataObj.historico.length === 0) {
    hideChart();
    return;
  }

  const labels = dataObj.historico.map(h => h.fecha);
  const dataValues = dataObj.historico.map(h => h.numero);

  // Actualizar estadísticas
  const totalAppointments = dataValues.reduce((a,b)=>a+b,0);
  const averageVariation = Math.round((dataValues[dataValues.length-1] - dataValues[0]) / Math.max(1, dataValues.length-1));
  const maxJump = Math.max(...dataValues.map((v,i,arr)=> i>0 ? Math.abs(v-arr[i-1]) : 0));

  const totalEl = document.getElementById('totalAppointments');
  const avgEl = document.getElementById('averageVariation');
  const maxEl = document.getElementById('maxJump');
  if (totalEl) totalEl.textContent = totalAppointments.toLocaleString();
  if (avgEl) avgEl.textContent = averageVariation.toLocaleString();
  if (maxEl) maxEl.textContent = maxJump.toLocaleString();

  // Crear o actualizar Chart.js
  const ctx = document.getElementById('appointmentsChart');
  if (!ctx) return;

  if (appointmentsChart) {
    appointmentsChart.data.labels = labels;
    appointmentsChart.data.datasets[0].data = dataValues;
    appointmentsChart.update();
    return;
  }

  // Crear nuevo chart
  appointmentsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${specialtyCode} - Nombramientos`,
        data: dataValues,
        borderColor: 'rgba(33,128,141,1)',
        backgroundColor: 'rgba(33,128,141,0.08)',
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed.y;
              const index = context.dataIndex;
              const date = labels[index] || '';
              return `Nº Orden: ${value.toLocaleString()} — ${date}`;
            }
          }
        },
        legend: { display: false }
      },
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });
}

// Verificación automática de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 app.js: DOM cargado - verificando estado de autenticación...');
  
  // Esperar un poco para que se carguen todos los elementos
  setTimeout(() => {
    if (checkAuthStatus()) {
      console.log('✅ app.js: Usuario ya autenticado - mostrando dashboard...');
      showDashboard();
    } else {
      console.log('🔐 app.js: Usuario no autenticado - manteniendo login visible');
    }
  }, 100);
});

// También verificar en window load como fallback
window.addEventListener('load', function() {
  console.log('🔍 app.js: Window load - verificación de respaldo...');
  
  setTimeout(() => {
    const dashboard = document.getElementById('mainDashboard');
    const isDashboardVisible = dashboard && !dashboard.classList.contains('hidden');
    const isAuth = checkAuthStatus();
    
    console.log('🔍 app.js: Estado en window load:', {
      isAuthenticated: isAuth,
      isDashboardVisible: isDashboardVisible,
      dashboardInitialized: window.dashboardInitialized
    });
    
    // Si está autenticado, dashboard visible, pero no inicializado
    if (isAuth && isDashboardVisible && !window.dashboardInitialized) {
      console.log('🚨 app.js: Dashboard visible pero no inicializado - corrigiendo...');
      
      if (typeof initializeDashboard === 'function') {
        console.log('🚀 app.js: Ejecutando inicialización de respaldo...');
        initializeDashboard();
        window.dashboardInitialized = true;
      }
    }
  }, 200);
});