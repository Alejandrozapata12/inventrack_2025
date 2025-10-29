// === ESTADO Y ALMACENAMIENTO ===
const KEY = 'inventrack_employee_v1';
let state = {
  products: [],
  categories: [],
  suppliers: [],
  movements: [],
  requests: [],
  returns: [],
  purchaseOrders: [],
  users: [],
  logs: [],
  settings: {
    lowStockThreshold: 5,
    notify: true,
    language: 'es'
  }
};

// === UTILIDADES ===
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function id() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
}

function showToast(msg, type = 'success') {
  const wrap = $('#toasts');
  if (!wrap) return;
  
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const color = type === 'success' ? 'var(--success-500)' : 'var(--danger-500)';
  el.innerHTML = `<i class="fa-solid ${icon}" style="color:${color}"></i><div>${escapeHtml(msg)}</div>`;
  wrap.appendChild(el);
  
  setTimeout(() => {
    el.classList.add('closing');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

function showCustomConfirm(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

function openModal(modalId) {
  const modal = $(`#${modalId}`);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = $(`#${modalId}`);
  if (modal) {
    modal.classList.remove('active');
  }
}

// === CONEXIÓN AL BACKEND ===
const API_BASE_URL = 'http://localhost:3000/api'; // Cambiar cuando se despliegue

// Función para obtener token JWT
function getToken() {
  return localStorage.getItem('token');
}

// Función para establecer token JWT
function setToken(token) {
  localStorage.setItem('token', token);
}

// Función para eliminar token JWT
function removeToken() {
  localStorage.removeItem('token');
}

// Función para obtener usuario actual
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Función para establecer usuario actual
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Función para eliminar usuario actual
function removeCurrentUser() {
  localStorage.removeItem('currentUser');
}

// Función para hacer llamadas a la API
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error('Error en llamada API:', error);
    showToast(error.message, 'error');
    throw error;
  }
}

// === AUTENTICACIÓN ===
async function login(email, password) {
  try {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.success) {
      setToken(data.data.token);
      setCurrentUser(data.data.user);
      showToast('Inicio de sesión exitoso');
      window.location.href = 'index.html'; // Redirigir a la página principal
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast('Error al iniciar sesión', 'error');
  }
}

async function logout() {
  showCustomConfirm('¿Estás seguro de que quieres cerrar sesión?', () => {
    removeToken();
    removeCurrentUser();
    window.location.href = 'login.html';
  });
}

// === RENDERIZADO DE SECCIONES ===
function renderSection(section) {
  // Ocultar todas las secciones
  $$('.section-card').forEach(sec => sec.style.display = 'none');
  
  // Mostrar la sección seleccionada
  const sectionElement = $(`#${section}Section`);
  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  
  // Actualizar título de la página
  const sectionTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Resumen general del inventario' },
    productos: { title: 'Inventario', subtitle: 'Consulta los productos disponibles en el almacén' },
    entradas: { title: 'Entradas', subtitle: 'Registra nuevas entradas de productos al inventario' },
    salidas: { title: 'Salidas', subtitle: 'Registra salidas de productos por ventas, devoluciones, etc.' },
    movimientos: { title: 'Historial de Movimientos', subtitle: 'Consulta, filtra y exporta todos los registros del inventario' },
    solicitudes: { title: 'Solicitudes de Stock', subtitle: 'Gestiona y consulta las solicitudes de productos' },
    ubicaciones: { title: 'Ubicaciones de Productos', subtitle: 'Consulta y actualiza las ubicaciones físicas de los productos' },
    devoluciones: { title: 'Gestión de Devoluciones', subtitle: 'Registra y consulta los productos devueltos al inventario' },
    informes: { title: 'Informes Básicos', subtitle: 'Genera reportes rápidos del estado del inventario' },
    alertas: { title: 'Alertas de Stock', subtitle: 'Productos que han alcanzado o están por debajo de su umbral de stock bajo' }
  };
  
  if (sectionTitles[section]) {
    $('.page-title').textContent = sectionTitles[section].title;
    $('.small').textContent = sectionTitles[section].subtitle;
  }
  
  // Renderizar contenido específico de la sección
  switch(section) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'productos':
      renderProducts();
      break;
    case 'entradas':
      renderEntries();
      break;
    case 'salidas':
      renderExits();
      break;
    case 'movimientos':
      renderMovements();
      break;
    case 'solicitudes':
      renderRequests();
      break;
    case 'ubicaciones':
      renderLocations();
      break;
    case 'devoluciones':
      renderReturns();
      break;
    case 'informes':
      renderReports();
      break;
    case 'alertas':
      renderAlerts();
      break;
  }
}

// === DASHBOARD ===
async function renderDashboard() {
  try {
    // Obtener métricas del backend
    const productsResponse = await apiCall('/products');
    const movementsResponse = await apiCall('/movements');
    
    if (productsResponse.success && movementsResponse.success) {
      const products = productsResponse.data;
      const movements = movementsResponse.data;
      
      // Calcular métricas
      const totalProducts = products.length;
      
      const today = new Date().toISOString().split('T')[0];
      const todayMovements = movements.filter(m => m.date.startsWith(today));
      const todayEntries = todayMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.qty, 0);
      const todayExits = todayMovements.filter(m => m.type === 'salida').reduce((sum, m) => sum + m.qty, 0);
      
      const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
      
      // Actualizar métricas en el DOM
      $('#metricProducts').textContent = totalProducts;
      $('#metricEntries').textContent = todayEntries;
      $('#metricExits').textContent = todayExits;
      $('#metricValue').textContent = formatCurrency(inventoryValue);
      
      // Renderizar movimientos recientes
      renderRecentMovements(movements.slice(0, 5));
      
      // Renderizar solicitudes pendientes
      renderPendingRequests();
    } else {
      showToast('Error al cargar datos del dashboard', 'error');
    }
  } catch (error) {
    showToast('Error al cargar el dashboard', 'error');
  }
}

function renderRecentMovements(movements) {
  const tbody = $('#activityTbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (movements.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay movimientos recientes</td></tr>`;
    return;
  }
  
  movements.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(m.date)}</td>
      <td><span class="status-badge ${m.type === 'entrada' ? 'status-entry' : 'status-exit'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
      <td>${escapeHtml(m.product?.name || 'Producto no encontrado')}</td>
      <td>${m.qty}</td>
      <td>${escapeHtml(m.responsible)}</td>
      <td>${formatCurrency(m.qty * (m.product?.price || 0))}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPendingRequests() {
  const tbody = $('#requestsTbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // En un sistema real, esto vendría del backend
  const pendingRequests = [
    { id: id(), date: new Date(Date.now() - 86400000).toISOString(), product: { name: 'Wireless Headphones' }, qty: 5, status: 'Pendiente' },
    { id: id(), date: new Date(Date.now() - 172800000).toISOString(), product: { name: 'USB Cable' }, qty: 10, status: 'Pendiente' }
  ];
  
  if (pendingRequests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay solicitudes pendientes</td></tr>`;
    return;
  }
  
  pendingRequests.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(r.product.name)}</td>
      <td>${r.qty}</td>
      <td>${new Date(r.date).toLocaleDateString()}</td>
      <td><span class="status-badge status-pending">${r.status}</span></td>
      <td>
          <button class="btn btn-ghost btn-sm" onclick="viewRequest('${r.id}')">
              <i class="fas fa-eye"></i>
          </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// === PRODUCTOS ===
async function renderProducts() {
  try {
    const response = await apiCall('/products');
    
    if (response.success) {
      const products = response.data;
      const tbody = $('#productsTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay productos en el inventario</td></tr>`;
        return;
      }
      
      products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.sku)}</td>
          <td>${escapeHtml(p.category?.name || 'N/A')}</td>
          <td>${p.stock}</td>
          <td>${formatCurrency(p.price)}</td>
          <td><span class="status-badge ${p.stock <= p.low_stock_threshold ? 'status-low' : 'status-ok'}">${p.stock <= p.low_stock_threshold ? 'Bajo' : 'Ok'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar productos', 'error');
  }
}

// === ENTRADAS ===
async function renderEntries() {
  try {
    const response = await apiCall('/movements?filter=entrada');
    
    if (response.success) {
      const entries = response.data;
      const tbody = $('#entriesTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay entradas registradas</td></tr>`;
        return;
      }
      
      entries.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(e.date)}</td>
          <td>${escapeHtml(e.product?.name || 'Producto no encontrado')}</td>
          <td>${e.qty}</td>
          <td>${escapeHtml(e.responsible)}</td>
          <td>${formatCurrency(e.qty * (e.product?.price || 0))}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar entradas', 'error');
  }
}

function openEntryModal() {
  // Limpiar formulario
  $('#m_eProduct').value = '';
  $('#m_eQty').value = '';
  $('#m_eResp').value = getCurrentUser()?.name || 'Empleado';
  
  openModal('entryModal');
}

async function submitEntryModal() {
  const productId = $('#m_eProduct').value;
  const qty = parseInt($('#m_eQty').value);
  const responsible = $('#m_eResp').value.trim();
  
  if (!productId || qty <= 0 || !responsible) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }
  
  try {
    const response = await apiCall('/movements', {
      method: 'POST',
      body: JSON.stringify({
        type: 'entrada',
        productId,
        qty,
        responsible,
        notes: ''
      })
    });
    
    if (response.success) {
      closeModal('entryModal');
      showToast('Entrada registrada exitosamente');
      renderEntries();
      renderDashboard(); // Actualizar dashboard
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al registrar entrada', 'error');
  }
}

// === SALIDAS ===
async function renderExits() {
  try {
    const response = await apiCall('/movements?filter=salida');
    
    if (response.success) {
      const exits = response.data;
      const tbody = $('#exitsTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (exits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay salidas registradas</td></tr>`;
        return;
      }
      
      exits.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(e.date)}</td>
          <td>${escapeHtml(e.product?.name || 'Producto no encontrado')}</td>
          <td>${e.qty}</td>
          <td>${escapeHtml(e.responsible)}</td>
          <td>${formatCurrency(e.qty * (e.product?.price || 0))}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar salidas', 'error');
  }
}

function openExitModal() {
  // Limpiar formulario
  $('#m_xProduct').value = '';
  $('#m_xQty').value = '';
  $('#m_xResp').value = getCurrentUser()?.name || 'Empleado';
  
  openModal('exitModal');
}

async function submitExitModal() {
  const productId = $('#m_xProduct').value;
  const qty = parseInt($('#m_xQty').value);
  const responsible = $('#m_xResp').value.trim();
  
  if (!productId || qty <= 0 || !responsible) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }
  
  try {
    const response = await apiCall('/movements', {
      method: 'POST',
      body: JSON.stringify({
        type: 'salida',
        productId,
        qty,
        responsible,
        notes: ''
      })
    });
    
    if (response.success) {
      closeModal('exitModal');
      showToast('Salida registrada exitosamente');
      renderExits();
      renderDashboard(); // Actualizar dashboard
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al registrar salida', 'error');
  }
}

// === MOVIMIENTOS ===
async function renderMovements() {
  try {
    const response = await apiCall('/movements');
    
    if (response.success) {
      const movements = response.data;
      const tbody = $('#movimientosTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (movements.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No hay movimientos registrados</td></tr>`;
        return;
      }
      
      movements.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(m.date)}</td>
          <td><span class="status-badge ${m.type === 'entrada' ? 'status-entry' : 'status-exit'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
          <td>${escapeHtml(m.product?.sku || 'N/A')}</td>
          <td>${escapeHtml(m.product?.name || 'Producto no encontrado')}</td>
          <td>${m.qty}</td>
          <td>${escapeHtml(m.responsible)}</td>
          <td>${formatCurrency(m.qty * (m.product?.price || 0))}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar movimientos', 'error');
  }
}

// === SOLICITUDES ===
async function renderRequests() {
  try {
    const response = await apiCall('/requests');
    
    if (response.success) {
      const requests = response.data;
      const tbody = $('#requestsTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay solicitudes registradas</td></tr>`;
        return;
      }
      
      requests.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(r.date)}</td>
          <td>${escapeHtml(r.product?.name || 'Producto no encontrado')}</td>
          <td>${r.qty}</td>
          <td>${escapeHtml(r.justification)}</td>
          <td><span class="status-badge ${r.status === 'Pendiente' ? 'status-pending' : r.status === 'Aprobada' ? 'status-approved' : 'status-low'}">${r.status}</span></td>
          <td class="table-actions">
            <button class="btn btn-ghost btn-sm" onclick="viewRequest('${r.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar solicitudes', 'error');
  }
}

function openRequestModal() {
  // Limpiar formulario
  $('#m_reqProduct').value = '';
  $('#m_reqQty').value = '';
  $('#m_reqJustification').value = '';
  $('#m_reqIndex').value = '';
  
  openModal('requestModal');
}

async function saveRequestModal() {
  const productId = $('#m_reqProduct').value;
  const qty = parseInt($('#m_reqQty').value);
  const justification = $('#m_reqJustification').value.trim();
  const responsible = getCurrentUser()?.name || 'Empleado';
  
  if (!productId || qty <= 0 || !responsible) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }
  
  try {
    const response = await apiCall('/requests', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        qty,
        responsible,
        justification
      })
    });
    
    if (response.success) {
      closeModal('requestModal');
      showToast('Solicitud enviada exitosamente');
      renderRequests();
      renderDashboard(); // Actualizar dashboard
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al enviar solicitud', 'error');
  }
}

function viewRequest(id) {
  showToast(`Viendo solicitud con ID: ${id}`, 'info');
  // En un sistema real, abrirías un modal con los detalles de la solicitud
}

// === UBICACIONES ===
async function renderLocations() {
  try {
    const response = await apiCall('/products');
    
    if (response.success) {
      const products = response.data;
      const tbody = $('#locationsTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay productos en el inventario</td></tr>`;
        return;
      }
      
      products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.sku)}</td>
          <td>${p.stock}</td>
          <td>${escapeHtml(p.location || 'N/A')}</td>
          <td class="table-actions">
            <button class="btn btn-ghost btn-sm" onclick="openLocationEdit('${p.id}', '${escapeHtml(p.name)}', '${escapeHtml(p.sku)}', '${escapeHtml(p.location || '')}')">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar ubicaciones', 'error');
  }
}

function openLocationEdit(productId, productName, productSKU, currentLocation) {
  // Pre-rellenar el formulario
  $('#m_locProductName').value = productName;
  $('#m_locProductSKU').value = productSKU;
  $('#m_locLocation').value = currentLocation;
  $('#m_locProductId').value = productId;
  
  openModal('locationModal');
}

async function saveLocationModal() {
  const productId = $('#m_locProductId').value;
  const location = $('#m_locLocation').value.trim();
  
  if (!productId || !location) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }
  
  try {
    const response = await apiCall(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({
        location
      })
    });
    
    if (response.success) {
      closeModal('locationModal');
      showToast('Ubicación actualizada exitosamente');
      renderLocations();
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al actualizar ubicación', 'error');
  }
}

// === DEVOLUCIONES ===
async function renderReturns() {
  try {
    const response = await apiCall('/returns');
    
    if (response.success) {
      const returns = response.data;
      const tbody = $('#returnsTbody');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (returns.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay devoluciones registradas</td></tr>`;
        return;
      }
      
      returns.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatDate(r.date)}</td>
          <td>${escapeHtml(r.product?.name || 'Producto no encontrado')}</td>
          <td>${r.qty}</td>
          <td>${escapeHtml(r.reason)}</td>
          <td>${escapeHtml(r.responsible)}</td>
          <td>${formatCurrency(r.qty * (r.product?.price || 0))}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar devoluciones', 'error');
  }
}

function openReturnModal() {
  // Limpiar formulario
  $('#m_retProduct').value = '';
  $('#m_retQty').value = '';
  $('#m_retReason').value = '';
  $('#m_retResponsible').value = getCurrentUser()?.name || 'Empleado';
  
  openModal('returnModal');
}

async function saveReturnModal() {
  const productId = $('#m_retProduct').value;
  const qty = parseInt($('#m_retQty').value);
  const reason = $('#m_retReason').value.trim();
  const responsible = $('#m_retResponsible').value.trim();
  
  if (!productId || qty <= 0 || !reason || !responsible) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }
  
  try {
    const response = await apiCall('/returns', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        qty,
        reason,
        responsible
      })
    });
    
    if (response.success) {
      closeModal('returnModal');
      showToast('Devolución registrada exitosamente');
      renderReturns();
      renderDashboard(); // Actualizar dashboard
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al registrar devolución', 'error');
  }
}

// === INFORMES ===
async function renderReports() {
  try {
    // Obtener productos y movimientos del backend
    const productsResponse = await apiCall('/products');
    const movementsResponse = await apiCall('/movements');
    
    if (productsResponse.success && movementsResponse.success) {
      const products = productsResponse.data;
      const movements = movementsResponse.data;
      
      // Renderizar Stock por Categoría
      renderStockByCategory(products);
      
      // Renderizar Movimientos del Día
      renderDailyMovements(movements);
    } else {
      showToast('Error al cargar datos para los informes', 'error');
    }
  } catch (error) {
    showToast('Error al generar informes', 'error');
  }
}

function renderStockByCategory(products) {
  const tbody = $('#stockByCategoryTbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Agrupar productos por categoría
  const productsByCategory = {};
  products.forEach(p => {
    const categoryId = p.category_id;
    if (!productsByCategory[categoryId]) {
      productsByCategory[categoryId] = {
        categoryName: p.category?.name || 'Sin Categoría',
        uniqueProducts: 0,
        totalStock: 0,
        totalValue: 0
      };
    }
    productsByCategory[categoryId].uniqueProducts++;
    productsByCategory[categoryId].totalStock += p.stock;
    productsByCategory[categoryId].totalValue += p.stock * p.price;
  });
  
  // Renderizar tabla
  Object.values(productsByCategory).forEach(cat => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(cat.categoryName)}</td>
      <td>${cat.uniqueProducts}</td>
      <td>${cat.totalStock}</td>
      <td>${formatCurrency(cat.totalValue)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDailyMovements(movements) {
  const tbody = $('#dailyMovementsTbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const today = new Date().toISOString().split('T')[0];
  const todayMovements = movements.filter(m => m.date.startsWith(today));
  
  if (todayMovements.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay movimientos hoy</td></tr>`;
    return;
  }
  
  todayMovements.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(m.date)}</td>
      <td><span class="status-badge ${m.type === 'entrada' ? 'status-entry' : 'status-exit'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
      <td>${escapeHtml(m.product?.name || 'Producto no encontrado')}</td>
      <td>${m.qty}</td>
      <td>${escapeHtml(m.responsible)}</td>
      <td>${formatCurrency(m.qty * (m.product?.price || 0))}</td>
    `;
    tbody.appendChild(tr);
  });
}

// === ALERTAS ===
async function renderAlerts() {
  try {
    const response = await apiCall('/products?lowStock=true');
    
    if (response.success) {
      const products = response.data;
      const container = $('#alertsContainer');
      
      if (!container) return;
      
      container.innerHTML = '';
      
      if (products.length === 0) {
        container.innerHTML = `<div class="alert-empty">No hay productos con bajo stock</div>`;
        return;
      }
      
      products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'alert-card';
        div.innerHTML = `
          <div class="alert-icon"><i class="fa-solid fa-bell"></i></div>
          <div class="alert-content">
            <div class="alert-header">
              <div class="alert-title">${escapeHtml(p.name)}</div>
              <div class="alert-date">${formatDate(p.updated_at)}</div>
            </div>
            <div class="alert-message">El producto "${escapeHtml(p.name)}" tiene solo ${p.stock} unidades disponibles, por debajo del umbral de ${p.low_stock_threshold}.</div>
            <div class="alert-actions">
              <button class="btn btn-ghost btn-sm" onclick="viewProduct('${p.id}')">
                <i class="fas fa-eye"></i> Ver Producto
              </button>
              <button class="btn btn-ghost btn-sm" onclick="createRequestForProduct('${p.id}')">
                <i class="fas fa-paper-plane"></i> Solicitar Más
              </button>
            </div>
          </div>
          <span class="alert-badge">¡Urgente!</span>
        `;
        container.appendChild(div);
      });
    } else {
      showToast(response.message, 'error');
    }
  } catch (error) {
    showToast('Error al cargar alertas', 'error');
  }
}

function createRequestForProduct(productId) {
  // Abrir modal de solicitud pre-rellenado
  openRequestModal();
  $('#m_reqProduct').value = productId;
  $('#m_reqQty').value = 10; // Valor predeterminado
  $('#m_reqJustification').value = 'Solicitud automática por bajo stock';
}

// === INICIALIZACIÓN DE LA APLICACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si el usuario está autenticado
  const token = getToken();
  const currentUser = getCurrentUser();
  
  if (!token || !currentUser) {
    // Si no hay token o usuario, redirigir al login
    window.location.href = 'login.html';
    return;
  }
  
  // Actualizar información del usuario en el header
  $('.profile-name').textContent = escapeHtml(currentUser.name);
  $('.profile-email').textContent = escapeHtml(currentUser.email);
  
  // Adjuntar event listeners
  attachEventListeners();
  
  // Renderizar sección inicial (dashboard)
  renderSection('dashboard');
  
  // Actualizar badge de notificaciones
  updateNotificationBadge();
});

function attachEventListeners() {
  // Navegación
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      if (section) {
        renderSection(section);
        // Actualizar enlace activo
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // Dropdown de perfil
  $('#profileToggle').addEventListener('click', function() {
    const dropdown = $('#profileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
  
  // Cerrar dropdown al hacer clic fuera
  window.addEventListener('click', function(e) {
    const profile = $('#profileToggle');
    const dropdown = $('#profileDropdown');
    if (!profile.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
  
  // Botones de logout
  $$('.logout-btn').forEach(btn => {
    btn.addEventListener('click', logout);
  });
  
  // Botones de modales
  $('#openEntryModal').addEventListener('click', openEntryModal);
  $('#openExitModal').addEventListener('click', openExitModal);
  $('#openRequestModal').addEventListener('click', openRequestModal);
  $('#openLocationModal').addEventListener('click', () => openLocationEdit('', '', '', ''));
  $('#openReturnModal').addEventListener('click', openReturnModal);
  
  // Formularios de modales
  $('#entryModal form').addEventListener('submit', function(e) {
    e.preventDefault();
    submitEntryModal();
  });
  
  $('#exitModal form').addEventListener('submit', function(e) {
    e.preventDefault();
    submitExitModal();
  });
  
  $('#requestModal form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveRequestModal();
  });
  
  $('#locationModal form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveLocationModal();
  });
  
  $('#returnModal form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveReturnModal();
  });
  
  // Botones de cierre de modales
  $$('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Cerrar modales al hacer clic fuera
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });
  
  // Filtros
  $('#productCategoryFilter').addEventListener('change', renderProducts);
  $('#minStockFilter').addEventListener('input', renderProducts);
  $('#maxStockFilter').addEventListener('input', renderProducts);
  
  $('#entryProductFilter').addEventListener('input', renderEntries);
  $('#entryResponsibleFilter').addEventListener('input', renderEntries);
  $('#entryStartDateFilter').addEventListener('change', renderEntries);
  $('#entryEndDateFilter').addEventListener('change', renderEntries);
  
  $('#exitProductFilter').addEventListener('input', renderExits);
  $('#exitResponsibleFilter').addEventListener('input', renderExits);
  $('#exitStartDateFilter').addEventListener('change', renderExits);
  $('#exitEndDateFilter').addEventListener('change', renderExits);
  
  $('#movementTypeFilter').addEventListener('change', renderMovements);
  $('#movementStartDateFilter').addEventListener('change', renderMovements);
  $('#movementEndDateFilter').addEventListener('change', renderMovements);
  
  $('#requestProductFilter').addEventListener('input', renderRequests);
  $('#requestResponsibleFilter').addEventListener('input', renderRequests);
  $('#requestStatusFilter').addEventListener('change', renderRequests);
  $('#requestStartDateFilter').addEventListener('change', renderRequests);
  $('#requestEndDateFilter').addEventListener('change', renderRequests);
  
  $('#locationProductFilter').addEventListener('input', renderLocations);
  $('#locationTextFilter').addEventListener('input', renderLocations);
  
  $('#returnProductFilter').addEventListener('input', renderReturns);
  $('#returnReasonFilter').addEventListener('input', renderReturns);
  $('#returnStartDateFilter').addEventListener('change', renderReturns);
  $('#returnEndDateFilter').addEventListener('change', renderReturns);
  
  // Búsqueda global
  $('#searchInput').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const currentSection = $$('.nav-link.active')[0]?.dataset.section;
    if (currentSection === 'productos') {
      renderProducts();
    }
  });
  
  // Exportar CSV
  $$('.btn-ghost').forEach(btn => {
    if (btn.textContent.includes('Exportar')) {
      btn.addEventListener('click', function() {
        const tableId = this.closest('.card').querySelector('table').id;
        downloadCSV(`#${tableId}`, `${tableId}.csv`);
      });
    }
  });
}

// === FUNCIONES AUXILIARES ===
function clearProductFilters() {
  $('#productCategoryFilter').value = '';
  $('#minStockFilter').value = '';
  $('#maxStockFilter').value = '';
  renderProducts();
}

function clearEntryFilters() {
  $('#entryProductFilter').value = '';
  $('#entryResponsibleFilter').value = '';
  $('#entryStartDateFilter').value = '';
  $('#entryEndDateFilter').value = '';
  renderEntries();
}

function clearExitFilters() {
  $('#exitProductFilter').value = '';
  $('#exitResponsibleFilter').value = '';
  $('#exitStartDateFilter').value = '';
  $('#exitEndDateFilter').value = '';
  renderExits();
}

function clearMovementFilters() {
  $('#movementTypeFilter').value = '';
  $('#movementStartDateFilter').value = '';
  $('#movementEndDateFilter').value = '';
  renderMovements();
}

function clearRequestFilters() {
  $('#requestProductFilter').value = '';
  $('#requestResponsibleFilter').value = '';
  $('#requestStatusFilter').value = '';
  $('#requestStartDateFilter').value = '';
  $('#requestEndDateFilter').value = '';
  renderRequests();
}

function clearLocationFilters() {
  $('#locationProductFilter').value = '';
  $('#locationTextFilter').value = '';
  renderLocations();
}

function clearReturnFilters() {
  $('#returnProductFilter').value = '';
  $('#returnReasonFilter').value = '';
  $('#returnStartDateFilter').value = '';
  $('#returnEndDateFilter').value = '';
  renderReturns();
}

function downloadCSV(tableSelector, filename) {
  const table = $(tableSelector);
  let csv = [];
  
  // Encabezados
  const headers = [];
  for (let i = 0; i < table.rows[0].cells.length; i++) {
    headers.push(table.rows[0].cells[i].innerText);
  }
  csv.push(headers.join(','));
  
  // Filas
  for (let i = 1; i < table.rows.length; i++) {
    const row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      row.push(table.rows[i].cells[j].innerText);
    }
    csv.push(row.join(','));
  }
  
  // Descargar
  const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
}

function updateNotificationBadge() {
  // En un sistema real, contar notificaciones no leídas del backend
  const unreadCount = 3; // Valor de ejemplo
  const badge = $('#alertsCount');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }
}