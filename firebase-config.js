/*
 * Firebase Configuration
 * Dashboard Bolsa Docents - Lleida
 * 
 * Desarrollado por @CarlesMiranda
 * Fecha: Septiembre 2025
 */

// Configuración de Firebase (reemplaza con tus datos del proyecto)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
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

// Autenticación anónima automática
function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserId = user.uid;
      console.log('Usuario autenticado:', currentUserId);
      loadDataFromFirestore();
    } else {
      // Si no hay usuario, crear uno anónimo
      signInAnonymously(auth).catch((error) => {
        console.error('Error en autenticación anónima:', error);
        showMessage('Error', 'Error de conexión con la base de datos', 'error');
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
  if (!currentUserId) return;
  
  try {
    const userDocRef = doc(db, 'users', currentUserId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Cargar datos existentes
      if (data.userInfo) appData.userInfo = data.userInfo;
      if (data.especialidadData) appData.especialidadData = data.especialidadData;
      if (data.projections) appData.projections = data.projections;
      if (data.allAppointments) appData.allAppointments = data.allAppointments;
      
      console.log('Datos cargados desde Firestore');
      renderAll();
    } else {
      // Si no existen datos, crear documento inicial
      await saveDataToFirestore();
      console.log('Documento inicial creado en Firestore');
    }
  } catch (error) {
    console.error('Error cargando desde Firestore:', error);
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
