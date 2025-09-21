/*
 * Firebase Configuration
 * Dashboard Bolsa Docents - Lleida
 * 
 * Desarrollado por @CarlesMiranda
 * Fecha: Septiembre 2025
 */

// Configuración de Firebase (datos reales del proyecto nomenaments-lleida)
const firebaseConfig = {
  apiKey: "AIzaSyD4Gcd20NGKzRMUTd1ce753TmO_XmuaRkA",
  authDomain: "nomenaments-lleida.firebaseapp.com",
  projectId: "nomenaments-lleida",
  storageBucket: "nomenaments-lleida.firebasestorage.app",
  messagingSenderId: "405634816282",
  appId: "1:405634816282:web:08ba7054b1d2096945f4a3",
  measurementId: "G-FZF50YR0D3"
};

// Inicializar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Variable global para el ID del usuario
let currentUserId = null;
let authInitialized = false;
let dataLoaded = false;

// Autenticación anónima automática
function initAuth() {
  if (authInitialized) {
    console.log('🔄 Firebase ya inicializado, saltando...');
    return;
  }
  
  authInitialized = true;
  console.log('🚀 Iniciando autenticación Firebase...');
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserId = user.uid;
      console.log('✅ Usuario autenticado en Firebase:', currentUserId);
      
      // IMPORTANTE: Solo cargar datos si el usuario está autenticado localmente también
      const localAuthToken = sessionStorage.getItem('bolsaDocentsAuth');
      
      if (localAuthToken && !dataLoaded) {
        dataLoaded = true; // Evitar cargas múltiples
        console.log('📊 Cargando datos una sola vez...');
        setTimeout(() => {
          loadDataFromFirestore();
        }, 500);
      } else if (!localAuthToken) {
        console.log('❌ Usuario sin sesión local, NO cargando datos');
      }
    } else {
      console.log('🔐 Iniciando autenticación anónima...');
      signInAnonymously(auth)
        .then((userCredential) => {
          console.log('✅ Autenticación anónima exitosa:', userCredential.user.uid);
        })
        .catch((error) => {
          console.error('❌ Error en autenticación anónima:', error);
          if (typeof showMessage === 'function') {
            showMessage('Error', 'Error de conexión con la base de datos', 'error');
          }
          loadDataFromLocalStorage();
        });
    }
  });
}

// Funciones de base de datos
async function saveDataToFirestore() {
  if (!currentUserId) return;
  
  try {
    const userDocRef = doc(db, 'users', currentUserId);
    await setDoc(userDocRef, {
      userInfo: appData.userInfo,
      especialidadData: appData.especialidadData,
      projections: appData.projections,
      allAppointments: appData.allAppointments,
      lastUpdated: new Date().toISOString()
    });
    
    console.log('Datos guardados en Firestore');
    return true;
  } catch (error) {
    console.error('Error guardando en Firestore:', error);
    showMessage('Error', 'Error al guardar datos en la nube', 'error');
    return false;
  }
}

async function loadDataFromFirestore() {
  if (!currentUserId) {
    console.log('No hay usuario autenticado, cargando desde localStorage');
    loadDataFromLocalStorage();
    return;
  }
  
  try {
    console.log('Cargando datos para usuario:', currentUserId);
    const userDocRef = doc(db, 'users', currentUserId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Documento encontrado en Firestore');
      
      // Verificar que appData existe antes de cargar
      if (typeof appData !== 'undefined') {
        // Cargar datos existentes
        if (data.userInfo) appData.userInfo = data.userInfo;
        if (data.especialidadData) appData.especialidadData = data.especialidadData;
        if (data.projections) appData.projections = data.projections;
        if (data.allAppointments) appData.allAppointments = data.allAppointments;
        
        console.log('Datos cargados desde Firestore');
        
        // Solo renderizar si la función existe
        if (typeof renderAll === 'function') {
          renderAll();
        }
      } else {
        console.log('appData no está disponible aún, reintentando en 1 segundo...');
        setTimeout(() => loadDataFromFirestore(), 1000);
      }
    } else {
      console.log('No existe documento, usando datos por defecto locales...');
      // En lugar de crear un documento vacío, usar los datos por defecto de appData
      console.log('📁 Usando datos por defecto de la aplicación');
      
      // Solo renderizar si appData ya tiene la estructura correcta
      if (typeof appData !== 'undefined' && appData.userInfo && typeof appData.userInfo.numero_orden === 'number') {
        if (typeof renderAll === 'function') {
          renderAll();
        }
      } else {
        console.log('⚠️ appData no tiene la estructura correcta, inicializando...');
        // Asegurar que appData tenga la estructura mínima necesaria
        if (typeof appData !== 'undefined' && appData.userInfo) {
          if (typeof appData.userInfo.numero_orden === 'undefined') {
            appData.userInfo.numero_orden = 101322; // Valor por defecto
          }
          if (!appData.userInfo.especialidades) {
            appData.userInfo.especialidades = [];
          }
        }
        
        if (typeof renderAll === 'function') {
          renderAll();
        }
      }
    }
  } catch (error) {
    console.error('Error cargando desde Firestore:', error);
    console.log('Código de error:', error.code);
    console.log('Mensaje de error:', error.message);
    
    // Mostrar error específico
    if (typeof showMessage === 'function') {
      if (error.code === 'permission-denied') {
        showMessage('Error', 'Error de permisos. Verificando autenticación...', 'error');
      } else {
        showMessage('Error', 'Error de conexión con la base de datos', 'error');
      }
    }
    
    // Fallback a localStorage si hay error con Firestore
    loadDataFromLocalStorage();
  }
}

// Función para migrar datos de localStorage a Firestore
async function migrateLocalStorageToFirestore() {
  const localData = localStorage.getItem('bolsaDocentsData');
  if (localData && currentUserId) {
    try {
      const parsedData = JSON.parse(localData);
      appData = parsedData;
      await saveDataToFirestore();
      
      // Opcional: limpiar localStorage después de migrar
      // localStorage.removeItem('bolsaDocentsData');
      
      showMessage('Éxito', 'Datos migrados a la nube correctamente');
    } catch (error) {
      console.error('Error migrando datos:', error);
    }
  }
}

// Funciones de respaldo para localStorage
function loadDataFromLocalStorage() {
  try {
    const saved = localStorage.getItem('bolsaDocentsData');
    if (saved) {
      appData = JSON.parse(saved);
      renderAll();
      return true;
    }
  } catch (error) {
    console.error('Error cargando desde localStorage:', error);
  }
  return false;
}

function saveDataToLocalStorage() {
  try {
    localStorage.setItem('bolsaDocentsData', JSON.stringify(appData));
    return true;
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
    return false;
  }
}

// Función principal de guardado (intenta Firestore primero, localStorage como respaldo)
async function saveData() {
  const firestoreSuccess = await saveDataToFirestore();
  if (!firestoreSuccess) {
    saveDataToLocalStorage();
  }
}

// Función principal de carga
function loadData() {
  // La carga se maneja automáticamente cuando el usuario se autentica
  return loadDataFromLocalStorage(); // Respaldo inmediato
}

// Exportar funciones para uso global
window.saveData = saveData;
window.loadData = loadData;
window.initAuth = initAuth;
window.migrateLocalStorageToFirestore = migrateLocalStorageToFirestore;

// Firebase Auth se inicializa automáticamente desde app.js
// No necesitamos DOMContentLoaded aquí para evitar inicializaciones duplicadas
