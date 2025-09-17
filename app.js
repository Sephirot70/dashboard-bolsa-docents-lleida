/*
 * Dashboard Bolsa Docents - Lleida
 * Sistema de gestión de nombramientos para docentes
 * 
 * Desarrollado por @CarlesMiranda
 * Fecha: Septiembre 2025
 */

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
  const authToken = sessionStorage.getItem('bolsaDocentsAuth');
  const authTime = sessionStorage.getItem('bolsaDocentsAuthTime');
  
  if (authToken && authTime) {
    const currentTime = new Date().getTime();
    const authTimeStamp = parseInt(authTime);
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 horas en millisegundos
    
    // Verificar si la sesión no ha expirado
    if (currentTime - authTimeStamp < sessionDuration) {
      isAuthenticated = true;
      showDashboard();
      return true;
    } else {
      // Sesión expirada, limpiar datos
      sessionStorage.removeItem('bolsaDocentsAuth');
      sessionStorage.removeItem('bolsaDocentsAuthTime');
    }
  }
  
  showLoginScreen();
  return false;
}

function showLoginScreen() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('mainDashboard').classList.add('hidden');
  
  // Focus en el campo de usuario para mejor UX
  setTimeout(() => {
    document.getElementById('username').focus();
  }, 100);
}

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainDashboard').classList.remove('hidden');
  isAuthenticated = true;
}

function authenticateUser(username, password) {
  // Verificar credenciales (case-insensitive para username)
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.trim();
  
  if ((normalizedUsername === AUTH_CONFIG.username.toLowerCase() || 
       normalizedUsername === AUTH_CONFIG.altUsername.toLowerCase()) && 
      normalizedPassword === AUTH_CONFIG.password) {
    
    // Guardar estado de autenticación
    const currentTime = new Date().getTime();
    sessionStorage.setItem('bolsaDocentsAuth', 'authenticated');
    sessionStorage.setItem('bolsaDocentsAuthTime', currentTime.toString());
    
    return true;
  }
  
  return false;
}

function handleLoginSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.querySelector('.login-btn-text');
  const btnLoading = document.querySelector('.login-btn-loading');
  const errorDiv = document.getElementById('loginError');
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // UI Loading state
  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  
  // Simular delay de autenticación para mejor UX
  setTimeout(() => {
    if (authenticateUser(username, password)) {
      // Login exitoso
      showDashboard();
      
      // Inicializar la aplicación principal
      if (typeof initAuth === 'function') {
        initAuth();
      } else {
        loadDataLocal();
        renderAll();
      }
    } else {
      // Login fallido
      errorDiv.classList.remove('hidden');
      
      // Limpiar campos
      document.getElementById('password').value = '';
      document.getElementById('username').focus();
      
      // Shake animation para el error
      errorDiv.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        errorDiv.style.animation = '';
      }, 500);
    }
    
    // Restaurar botón
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    
  }, 800); // Delay de 800ms para simular verificación
}

function logout() {
  sessionStorage.removeItem('bolsaDocentsAuth');
  sessionStorage.removeItem('bolsaDocentsAuthTime');
  isAuthenticated = false;
  showLoginScreen();
  
  // Limpiar formulario
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').classList.add('hidden');
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
      {"codigo": "712", "nombre": "Disseny Gràfic", "status": "pendent p.c."},
      {"codigo": "715", "nombre": "Fotografia", "status": "activa"},
      {"codigo": "507", "nombre": "Informàtica", "status": "pendent p.c."},
      {"codigo": "721", "nombre": "Mitjans Audiovisuals", "status": "activa"},
      {"codigo": "722", "nombre": "Mitjans Informàtics", "status": "pendent p.c."},
      {"codigo": "519", "nombre": "Processos I Mitjans De Comunicació", "status": "pendent p.c."},
      {"codigo": "522", "nombre": "Processos I Productes D'Arts Gràfiques", "status": "pendent p.c."},
      {"codigo": "623", "nombre": "Producció En Arts Gràfiques", "status": "pendent p.c."},
      {"codigo": "627", "nombre": "Sistemes I Aplicacions Informàtiques", "status": "pendent p.c."},
      {"codigo": "TEC", "nombre": "Tecnologia", "status": "activa"},
      {"codigo": "629", "nombre": "Tècniques I Procediments D'Imatge I So", "status": "pendent p.c."}
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
    {"id": "1", "fecha": "15/09/2025", "codigo": "507", "numero": 25060, "centro": "Institut Caparrella (Lleida)", "jornada": "Sencera", "inicio": "15/09/25", "fin": "29/09/25"},
    {"id": "2", "fecha": "15/09/2025", "codigo": "TEC", "numero": 28678, "centro": "Institut Màrius Torres (Lleida)", "jornada": "Sencera", "inicio": "15/09/25", "fin": "11/12/25"},
    {"id": "3", "fecha": "09/09/2025", "codigo": "623", "numero": 33155, "centro": "IES Caparrella (Lleida)", "jornada": "Sencera", "inicio": "09/09/25", "fin": "18/09/25"},
    {"id": "4", "fecha": "09/09/2025", "codigo": "TEC", "numero": 100374, "centro": "IES Lo Pla d'Urgell (Bellpuig)", "jornada": "0,50", "inicio": "09/09/25", "fin": "31/08/26"},
    {"id": "5", "fecha": "08/09/2025", "codigo": "507", "numero": 14779, "centro": "Lleida", "jornada": "0,50", "inicio": "08/09/25", "fin": "31/08/26"},
    {"id": "6", "fecha": "08/09/2025", "codigo": "TEC", "numero": 69390, "centro": "Bellpuig", "jornada": "0,50", "inicio": "08/09/25", "fin": "31/08/26"}
  ]
};

// Sorting state
let tableSortState = {
  column: 'fecha', // Default sort by fecha (order of entry)
  direction: 'desc' // desc = newest first (default behavior)
};

// Utility functions as before
function formatNumber(num) {
  return num.toLocaleString('es-ES');
}

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
  document.getElementById('messageModal').classList.remove('hidden');
}

function hideMessage() {
  document.getElementById('messageModal').classList.add('hidden');
}

function showFormModal() {
  document.getElementById('addAppointmentModal').classList.remove('hidden');
}

function hideFormModal() {
  document.getElementById('addAppointmentModal').classList.add('hidden');
  document.getElementById('appointmentForm').reset();
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
  displayElement.textContent = formatNumber(appData.userInfo.numero_orden);
}

// Specialty Management Functions
function showManageSpecialtiesModal() {
  document.getElementById('manageSpecialtiesModal').classList.remove('hidden');
  renderSpecialtiesList();
}

function hideManageSpecialtiesModal() {
  document.getElementById('manageSpecialtiesModal').classList.add('hidden');
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
  // Hide all other edit forms
  document.querySelectorAll('.specialty-edit-form').forEach(form => {
    form.classList.remove('active');
  });
  
  // Show edit form for this specialty
  const editForm = document.getElementById(`edit-form-${index}`);
  editForm.classList.add('active');
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
    appData.allAppointments = appData.allAppointments.filter(apt => apt.codigo !== deletedCode);
    
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
    if (appointment.codigo === oldCode) {
      appointment.codigo = newCode;
    }
  });
}

function updateSpecialtySelect() {
  const select = document.getElementById('especialidad');
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

// Table sorting functions
function sortAppointments(appointments, column, direction) {
  return [...appointments].sort((a, b) => {
    let valueA, valueB;
    
    switch (column) {
      case 'fecha':
        valueA = parseDate(a.fecha);
        valueB = parseDate(b.fecha);
        break;
      case 'especialidad':
        valueA = a.codigo.toLowerCase();
        valueB = b.codigo.toLowerCase();
        break;
      case 'numero':
        valueA = a.numero;
        valueB = b.numero;
        break;
      case 'centro':
        valueA = a.centro.toLowerCase();
        valueB = b.centro.toLowerCase();
        break;
      case 'duracion':
        // Sort by start date for duration
        valueA = parseDate(a.inicio);
        valueB = parseDate(b.inicio);
        break;
      case 'jornada':
        // Sort jornada: Sencera > 0,50 > 0,25
        const jornadaOrder = { 'Sencera': 3, '0,50': 2, '0,25': 1 };
        valueA = jornadaOrder[a.jornada] || 0;
        valueB = jornadaOrder[b.jornada] || 0;
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function handleTableSort(column) {
  // Toggle direction if clicking the same column, otherwise default to asc
  if (tableSortState.column === column) {
    tableSortState.direction = tableSortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    tableSortState.column = column;
    tableSortState.direction = 'asc';
  }
  
  updateTableSortIndicators();
  renderAppointmentsTable();
}

function updateTableSortIndicators() {
  // Remove all sort classes
  document.querySelectorAll('.appointments-table th.sortable').forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc');
  });
  
  // Add current sort class
  const currentHeader = document.querySelector(`[data-sort="${tableSortState.column}"]`);
  if (currentHeader) {
    currentHeader.classList.add(`sorted-${tableSortState.direction}`);
  }
}

function renderAppointmentsTable() {
  const tbody = document.querySelector('#appointmentsTable tbody');
  tbody.innerHTML = '';
  
  if (appData.allAppointments.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="7" style="text-align: center; color: var(--color-text-secondary); font-style: italic;">No hay nombramientos registrados</td>`;
    tbody.appendChild(row);
    return;
  }
  
  // Apply current sorting
  const sortedAppointments = sortAppointments(appData.allAppointments, tableSortState.column, tableSortState.direction);
  sortedAppointments.forEach(appointment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${appointment.fecha}</td><td><span class="specialty-badge">${appointment.codigo}</span></td><td class="order-number">${formatNumber(appointment.numero)}</td><td>${appointment.centro}</td><td><span class="duration-badge">${appointment.inicio} - ${appointment.fin}</span></td><td>${appointment.jornada}</td><td><button type="button" class="delete-btn" data-id="${appointment.id}">Eliminar</button></td>`;
    tbody.appendChild(row);
  });
  // Attach delete event listeners (not using inline)
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function(){
      deleteAppointment(this.getAttribute('data-id'));
    });
  });
}
function calculateRhythmAnalysis() {
  const normalRhythm = document.getElementById('normalRhythm');
  const significantJumps = document.getElementById('significantJumps');
  normalRhythm.innerHTML = '<div class="no-data-text">Sin datos suficientes para análisis</div>';
  significantJumps.innerHTML = '<div class="no-data-text">Sin saltos significativos detectados</div>';
  const tecData = appData.especialidadData.TEC;
  if (tecData && tecData.historico && tecData.historico.length > 1) {
    let jumps = [];
    let totalIncrease = 0;
    let periods = 0;
    for (let i = 1; i < tecData.historico.length; i++) {
      const current = tecData.historico[i];
      const previous = tecData.historico[i - 1];
      const difference = current.numero - previous.numero;
      totalIncrease += Math.abs(difference);
      periods++;
      if (Math.abs(difference) > 15000) {
        jumps.push({from: previous, to: current, difference: difference});
      }
    }
    if (periods > 0) {
      const averageIncrease = Math.round(totalIncrease / periods);
      normalRhythm.innerHTML = `<div class="rhythm-item"><span class="specialty">TEC</span><span class="progression">Progresión constante</span></div><div class="rhythm-detail"><small>Incremento promedio: ~${formatNumber(averageIncrease)}</small></div>`;
    }
    if (jumps.length > 0) {
      significantJumps.innerHTML = '';
      jumps.forEach(jump => {
        const el = document.createElement('div');
        el.className = 'rhythm-item warning';
        el.innerHTML = `<span class="specialty">TEC</span><span class="jump">${jump.difference > 0 ? '+' : ''}${formatNumber(jump.difference)} (${jump.from.fecha} → ${jump.to.fecha})</span>`;
        significantJumps.appendChild(el);
      });
    }
  }
}
function recalculateProjections() {
  Object.keys(appData.especialidadData).forEach(codigo => {
    const specialtyData = appData.especialidadData[codigo];
    if (specialtyData.historico && specialtyData.historico.length > 1) {
      const firstEntry = specialtyData.historico[0];
      const lastEntry = specialtyData.historico[specialtyData.historico.length - 1];
      const daysDiff = (parseDate(lastEntry.fecha) - parseDate(firstEntry.fecha)) / (1000 * 60 * 60 * 24);
      const numberDiff = lastEntry.numero - firstEntry.numero;
      if (daysDiff > 0 && numberDiff > 0) {
        const weeklyRate = (numberDiff / daysDiff) * 7;
        const remaining = Math.max(0, appData.userInfo.numero_orden - lastEntry.numero);
        const weeksEstimated = remaining / weeklyRate;
        const daysEstimated = weeksEstimated * 7;
        appData.projections[codigo] = {
          semanas_estimadas: Math.round(weeksEstimated * 100) / 100,
          dias_estimados: Math.round(daysEstimated * 100) / 100,
          restantes: remaining,
          ritmo_semanal: Math.round(weeklyRate)
        };
      }
    }
  });
}
function updateTimeEstimations() {
  const estimationCards = document.querySelectorAll('.estimation-card');
  const specialties = ['TEC', '507', '623'];
  specialties.forEach((codigo, index) => {
    if (estimationCards[index]) {
      const card = estimationCards[index];
      const timeValue = card.querySelector('.time-value');
      const timeUnit = card.querySelector('.time-unit');
      const detail = card.querySelector('.estimate-detail small');
      const projection = appData.projections[codigo];
      if (projection && typeof projection.dias_estimados === 'number') {
        timeValue.textContent = projection.dias_estimados;
        timeUnit.textContent = 'días';
        detail.textContent = `Restantes: ${formatNumber(projection.restantes)} posiciones`;
      } else {
        timeValue.textContent = 'N/D';
        timeUnit.textContent = 'datos insuf.';
        const remaining = appData.especialidadData[codigo] 
          ? Math.max(0, appData.userInfo.numero_orden - appData.especialidadData[codigo].ultimo_numero)
          : 'N/D';
        detail.textContent = `Restantes: ${remaining === 'N/D' ? 'N/D' : formatNumber(remaining)} posiciones`;
      }
    }
  });
}
function renderAll() {
  updateOrderNumberDisplay();
  renderSpecialtyCards();
  renderAppointmentsTable();
  updateTableSortIndicators();
  calculateRhythmAnalysis();
  updateTimeEstimations();
}
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación antes de inicializar la aplicación
  if (!checkAuthStatus()) {
    // Si no está autenticado, solo configurar el login
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
    
    // Permitir Enter en los campos de login
    document.getElementById('username').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('password').focus();
      }
    });
    
    document.getElementById('password').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleLoginSubmit(e);
      }
    });
    
    return; // No inicializar el resto hasta que se autentique
  }
  
  // Usuario ya autenticado, inicializar aplicación
  initializeMainApp();
});

function initializeMainApp() {
  // Inicializar autenticación de Firebase
  if (typeof initAuth === 'function') {
    initAuth();
  } else {
    // Fallback a localStorage si Firebase no está disponible
    loadDataLocal();
    renderAll();
  }
  
  // Añadir botón de logout
  addLogoutButton();
  
  // Form modal event listeners
  document.getElementById('openFormModalBtn').addEventListener('click', showFormModal);
  document.getElementById('closeFormModal').addEventListener('click', hideFormModal);
  document.getElementById('addAppointmentModal').addEventListener('click', function(e) {
    if (e.target === this) hideFormModal();
  });
  
  // Form event listeners
  document.getElementById('appointmentForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('clearFormBtn').addEventListener('click', function() {
    document.getElementById('appointmentForm').reset();
  });
  
  // Table sorting event listeners
  document.querySelectorAll('.appointments-table th.sortable').forEach(th => {
    th.addEventListener('click', function() {
      const sortColumn = this.getAttribute('data-sort');
      handleTableSort(sortColumn);
    });
  });
  
  // Order number editing event listeners
  document.getElementById('editOrderBtn').addEventListener('click', showEditOrderForm);
  document.getElementById('saveOrderBtn').addEventListener('click', updateOrderNumber);
  document.getElementById('cancelOrderBtn').addEventListener('click', hideEditOrderForm);
  
  // Handle Enter key in order input
  document.getElementById('newOrderNumber').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      updateOrderNumber();
    } else if (e.key === 'Escape') {
      hideEditOrderForm();
    }
  });
  
  // Close edit form when clicking outside
  document.addEventListener('click', function(e) {
    const editForm = document.getElementById('editOrderForm');
    const editBtn = document.getElementById('editOrderBtn');
    if (!editForm.contains(e.target) && !editBtn.contains(e.target)) {
      hideEditOrderForm();
    }
  });
  
  // Initialize order number display
  updateOrderNumberDisplay();
  
  // Specialty management event listeners
  document.getElementById('manageSpecialtiesBtn').addEventListener('click', showManageSpecialtiesModal);
  document.getElementById('closeSpecialtiesModal').addEventListener('click', hideManageSpecialtiesModal);
  document.getElementById('manageSpecialtiesModal').addEventListener('click', function(e) {
    if (e.target === this) hideManageSpecialtiesModal();
  });
  document.getElementById('addSpecialtyForm').addEventListener('submit', addNewSpecialty);
  
  // Message modal event listeners
  document.getElementById('closeModal').addEventListener('click', hideMessage);
  document.getElementById('messageModal').addEventListener('click', function(e) {
    if (e.target === this) hideMessage();
  });
}