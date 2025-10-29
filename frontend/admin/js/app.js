// === ESTADO DE LA APLICACIÓN ===
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
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function id() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// === INICIALIZACIÓN ===
function initApp() {
  load();
  renderSection('dashboard');
  attachEventListeners();
  updateTheme();
  populateSelects();
  updateProfileAvatar(); 
}
 


function attachEventListeners() {
  // Eventos de navegación
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) {
        renderSection(section);
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Evento de búsqueda global
  const searchInput = $('.search input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      // Implementar búsqueda global si es necesario
    });
  }

  // Evento de teclado para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('.modal-overlay.active');
    }
  });
}

// === GESTIÓN DE ESTADO ===
function save() {
  localStorage.setItem('inventrack_state', JSON.stringify(state));
}

function load() {
  const saved = localStorage.getItem('inventrack_state');
  if (saved) {
    state = JSON.parse(saved);
  } else {
    // Datos iniciales
    if (!state.categories || state.categories.length === 0) {
      state.categories = [
        { id: id(), name: 'Electrónicos', desc: 'Dispositivos electrónicos y componentes' },
        { id: id(), name: 'Ropa', desc: 'Prendas de vestir y accesorios' },
        { id: id(), name: 'Hogar', desc: 'Artículos para el hogar' }
      ];
    }
    if (!state.suppliers || state.suppliers.length === 0) {
      state.suppliers = [
        { id: id(), name: 'Distribuciones Tech SA', contact: 'ventas@dist.com', phone: '+573001112222' },
        { id: id(), name: 'Global Imports', contact: 'contact@global.com', phone: '+573203334444' }
      ];
    }
    if (!state.products || state.products.length === 0) {
      state.products = [
        { id: id(), name: 'Laptop Avanzada Pro 14"', sku: 'LP-PRO-14G2', categoryId: state.categories[0].id, supplierId: state.suppliers[0].id, stock: 15, price: 2500000.00, location: 'Almacén 1, Pasillo A-1', lowStockThreshold: 5 },
        { id: id(), name: 'Camiseta Premium', sku: 'CT-PREM-001', categoryId: state.categories[1].id, supplierId: state.suppliers[1].id, stock: 3, price: 45000.00, location: 'Almacén 2, Estantería B-3', lowStockThreshold: 10 }
      ];
    }
    if (!state.movements || state.movements.length === 0) {
      state.movements = [
        { date: new Date(Date.now() - 86400000).toISOString(), type: 'entrada', productId: state.products[0].id, qty: 10, responsible: 'Sistema' },
        { date: new Date().toISOString(), type: 'salida', productId: state.products[1].id, qty: 2, responsible: 'Ana García' },
      ];
    }
    if (!state.requests || state.requests.length === 0) {
      state.requests = [
        { id: id(), date: new Date(Date.now() - 10800000).toISOString(), productId: state.products[0].id, qty: 5, responsible: 'Juan Pérez', justification: 'Reposición de inventario', status: 'Aprobada' },
        { id: id(), date: new Date(Date.now() - 14400000).toISOString(), productId: state.products[1].id, qty: 20, responsible: 'María López', justification: 'Evento corporativo', status: 'Pendiente' }
      ];
    }
    if (!state.returns || state.returns.length === 0) {
      state.returns = [
        { id: id(), date: new Date(Date.now() - 10800000).toISOString(), productId: state.products[0].id, qty: 1, reason: 'Producto defectuoso', responsible: 'Admin' },
        { id: id(), date: new Date(Date.now() - 14400000).toISOString(), productId: state.products[1].id, qty: 1, reason: 'Cambio por talla', responsible: 'Empleado' }
      ];
    }
    if (!state.purchaseOrders || state.purchaseOrders.length === 0) {
      state.purchaseOrders = [
        { id: id(), date: new Date(Date.now() - 172800000).toISOString(), productId: state.products[0].id, qtyOrdered: 20, qtyReceived: 0, supplierId: state.suppliers[0].id, status: 'Creado' },
        { id: id(), date: new Date(Date.now() - 86400000).toISOString(), productId: state.products[1].id, qtyOrdered: 100, qtyReceived: 50, supplierId: state.suppliers[1].id, status: 'Recibido Parcial' }
      ];
    }
    if (!state.users || state.users.length === 0) {
      state.users = [
        { id: id(), name: 'Alejandro Zuluaga', email: 'admin@inventrack.com', role: 'admin' },
        { id: id(), name: 'Empleado de Bodega', email: 'user@inventrack.com', role: 'user' }
      ];
    }
    if (!state.logs || state.logs.length === 0) {
      state.logs = [
        { date: new Date().toISOString(), userId: state.users[0].id, actionType: 'Inicio de sesión', details: 'Alejandro Zuluaga ha iniciado sesión' },
        { date: new Date().toISOString(), userId: state.users[0].id, actionType: 'Producto Creado', details: 'Nuevo producto: Laptop Avanzada Pro 14"' }
      ];
    }
    save();
  }
}

// === INTERFACES ===
function renderSection(section) {

    // Guardar sección actual en variable global
  window.currentSection = section; // <-- Agregar esta línea

  // Ocultar todas las secciones
  $$('section.section-card').forEach(s => s.style.display = 'none');
  // Mostrar la sección solicitada
  $(`#${section}Section`).style.display = 'block';
  // Actualizar título del header
  const sectionInfo = {
    dashboard: { title: "Dashboard", subtitle: "Resumen general del inventario" },
    productos: { title: "Gestión de Productos", subtitle: "Administra los productos de tu inventario" },
    categorias: { title: "Gestión de Categorías", subtitle: "Administra las categorías de tus productos" },
    proveedores: { title: "Gestión de Proveedores", subtitle: "Gestiona la información de contacto de tus proveedores." },
    movimientos: { title: "Movimientos de Inventario", subtitle: "Consulta entradas y salidas de productos" },
    solicitudes: { title: "Solicitudes de Stock", subtitle: "Gestiona y consulta las solicitudes de productos" },
    devoluciones: { title: "Gestión de Devoluciones", subtitle: "Registra y consulta los productos devueltos" },
    pedidos: { title: "Pedidos de Compra", subtitle: "Gestiona los pedidos realizados a tus proveedores" },
    reportes: { title: "Reportes", subtitle: "Genera y exporta informes clave del inventario" },
    alertas: { title: "Alertas de Stock", subtitle: "Productos que necesitan tu atención" },
    usuarios: { title: "Gestión de Usuarios", subtitle: "Gestiona los usuarios y roles del sistema" },
    configuracion: { title: "Configuración", subtitle: "Personaliza el comportamiento de tu inventario" }
  };

  if (sectionInfo[section]) {
    $('.page-title').textContent = sectionInfo[section].title;
    $('.header .small').textContent = sectionInfo[section].subtitle;
  }

  // Renderizar contenido específico
  const renderMap = {
    dashboard: renderDashboard,
    productos: renderProducts,
    categorias: renderCategories,
    proveedores: renderSuppliers,
    movimientos: renderMovements,
    solicitudes: renderRequests,
    devoluciones: renderReturns,
    pedidos: renderPurchaseOrders,
    reportes: renderReports,
    alertas: renderAlerts,
    usuarios: renderUsers,
    configuracion: renderSettings,
    userHistory: renderUserHistory,
    logs: renderLogs
  };

  if (renderMap[section]) renderMap[section]();
}

// === RENDERERS Y FILTROS ===
function renderDashboard() {
  const todayMovements = state.movements.filter(m => isToday(m.date));
  $('#metricProducts').textContent = state.products.length;
  $('#metricEntries').textContent = todayMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.qty, 0);
  $('#metricExits').textContent = todayMovements.filter(m => m.type === 'salida').reduce((sum, m) => sum + m.qty, 0);
  $('#metricInventory').textContent = formatCurrency(state.products.reduce((sum, p) => sum + (p.stock * p.price), 0));

  // Movimientos recientes
  const tbody = $('#recentMovementsTbody');
  tbody.innerHTML = '';
  const recent = [...state.movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  recent.forEach(m => {
    const product = state.products.find(p => p.id === m.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(m.date).toLocaleString()}</td>
      <td><span class="status-badge ${m.type === 'entrada' ? 'status-entry' : 'status-exit'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
      <td>${product ? escape(product.name) : 'Producto no encontrado'}</td>
      <td>${m.qty}</td>
      <td>${m.responsible}</td>
    `;
    tbody.appendChild(tr);
  });
}

function isToday(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

function renderProducts() {
  const tbody = $('#productsTbody');
  tbody.innerHTML = '';

  // Filtros
  const categoryFilter = $('#productCategoryFilter')?.value || '';
  const minStockFilter = parseInt($('#minStockFilter')?.value || 0);
  const maxStockFilter = parseInt($('#maxStockFilter')?.value || Infinity);

  const filtered = state.products.filter(p => {
    const matchesCategory = categoryFilter === '' || p.categoryId === categoryFilter;
    const matchesMinStock = p.stock >= minStockFilter;
    const matchesMaxStock = p.stock <= maxStockFilter;
    return matchesCategory && matchesMinStock && matchesMaxStock;
  });

  filtered.forEach(p => {
    const category = state.categories.find(c => c.id === p.categoryId);
    const supplier = state.suppliers.find(s => s.id === p.supplierId);
    const tr = document.createElement('tr');
    const lowThreshold = p.lowStockThreshold !== undefined ? p.lowStockThreshold : state.settings.lowStockThreshold;
    const stockClass = p.stock <= lowThreshold ? 'status-low' : 'status-normal';
    tr.innerHTML = `
      <td>${escape(p.sku)}</td>
      <td>${escape(p.name)}</td>
      <td>${category ? escape(category.name) : 'Categoría no encontrada'}</td>
      <td>${supplier ? escape(supplier.name) : 'Proveedor no encontrado'}</td>
      <td><span class="status-badge ${stockClass}">${p.stock}</span></td>
      <td>${p.location ? escape(p.location) : '-'}</td>
      <td>${formatCurrency(p.price)}</td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="openProductModalForEdit('${p.id}')" aria-label="Editar Producto"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-ghost" onclick="openProductHistory('${p.id}')" aria-label="Historial"><i class="fa-solid fa-clock-rotate-left"></i></button>
        <button class="btn btn-ghost" onclick="removeProduct('${p.id}')" aria-label="Eliminar Producto"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  populateProductFilters();
  updateAlertsCount();
}

function populateProductFilters() {
  const categorySelect = $('#productCategoryFilter');
  if (!categorySelect) return;
  categorySelect.innerHTML = '<option value="">Todas</option>';
  state.categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.name;
    categorySelect.appendChild(option);
  });
}

function renderCategories() {
  const tbody = $('#categoriesTbody');
  tbody.innerHTML = '';
  state.categories.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escape(c.name)}</td>
      <td>${c.desc ? escape(c.desc) : '-'}</td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="openCategoryModalForEdit('${c.id}')" aria-label="Editar Categoría"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-ghost" onclick="removeCategory('${c.id}')" aria-label="Eliminar Categoría"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSuppliers() {
  const tbody = $('#suppliersTbody');
  tbody.innerHTML = '';

  // Filtros
  const supplierFilter = $('#supplierFilter')?.value?.toLowerCase() || '';

  const filtered = state.suppliers.filter(s => {
    const matchesName = s.name.toLowerCase().includes(supplierFilter);
    const matchesContact = s.contact.toLowerCase().includes(supplierFilter);
    const matchesPhone = s.phone.includes(supplierFilter);
    return matchesName || matchesContact || matchesPhone;
  });

  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escape(s.name)}</td>
      <td>${s.contact}</td>
      <td>${s.phone}</td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="openSupplierModalForEdit('${s.id}')" aria-label="Editar Proveedor"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-ghost" onclick="removeSupplier('${s.id}')" aria-label="Eliminar Proveedor"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderMovements() {
  const tbody = $('#movimientosTbody');
  tbody.innerHTML = '';

  // Filtros
  const typeFilter = $('#movementTypeFilter')?.value || '';
  const responsibleFilter = $('#movementResponsibleFilter')?.value?.toLowerCase() || '';
  const startDateFilter = $('#movementStartDateFilter')?.value;
  const endDateFilter = $('#movementEndDateFilter')?.value;

  const filtered = state.movements.filter(m => {
    const matchesType = typeFilter === '' || m.type === typeFilter;
    const matchesResponsible = responsibleFilter === '' || m.responsible.toLowerCase().includes(responsibleFilter);
    const movementDate = new Date(m.date);
    const matchesStartDate = !startDateFilter || movementDate >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || movementDate <= new Date(endDateFilter + 'T23:59:59');
    return matchesType && matchesResponsible && matchesStartDate && matchesEndDate;
  });

  [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
    const product = state.products.find(p => p.id === m.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(m.date).toLocaleString()}</td>
      <td><span class="status-badge ${m.type === 'entrada' ? 'status-entry' : 'status-exit'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
      <td>${product ? escape(product.sku) : 'Producto no encontrado'}</td>
      <td>${product ? escape(product.name) : 'Producto no encontrado'}</td>
      <td>${m.qty}</td>
      <td>${m.responsible}</td>
      <td>${formatCurrency(m.qty * (product ? product.price : 0))}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRequests() {
  const tbody = $('#requestsTbody');
  tbody.innerHTML = '';

  // Filtros
  const productFilter = $('#requestProductFilter')?.value?.toLowerCase() || '';
  const responsibleFilter = $('#requestResponsibleFilter')?.value?.toLowerCase() || '';
  const statusFilter = $('#requestStatusFilter')?.value || '';
  const startDateFilter = $('#requestStartDateFilter')?.value;
  const endDateFilter = $('#requestEndDateFilter')?.value;

  const filtered = state.requests.filter(req => {
    const product = state.products.find(p => p.id === req.productId);
    const matchesProduct = productFilter === '' || (product && (product.name.toLowerCase().includes(productFilter) || product.sku.toLowerCase().includes(productFilter)));
    const matchesResponsible = responsibleFilter === '' || req.responsible.toLowerCase().includes(responsibleFilter);
    const matchesStatus = statusFilter === '' || req.status === statusFilter;
    const requestDate = new Date(req.date);
    const matchesStartDate = !startDateFilter || requestDate >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || requestDate <= new Date(endDateFilter + 'T23:59:59');
    return matchesProduct && matchesResponsible && matchesStatus && matchesStartDate && matchesEndDate;
  });

  [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((req, idx) => {
    const product = state.products.find(p => p.id === req.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(req.date).toLocaleString()}</td>
      <td>${product ? escape(product.name) : 'Producto no encontrado'}</td>
      <td>${req.qty}</td>
      <td>${req.responsible}</td>
      <td>${req.justification || 'Sin justificación'}</td>
      <td><span class="status-badge ${req.status === 'Aprobada' ? 'status-approved' : req.status === 'Pendiente' ? 'status-pending' : 'status-low'}">${req.status}</span></td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="openRequestEdit('${req.id}')" aria-label="Editar Solicitud"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-ghost" onclick="removeRequest('${req.id}')" aria-label="Eliminar Solicitud"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderReturns() {
  const tbody = $('#returnsTbody');
  tbody.innerHTML = '';

  // Filtros
  const productFilter = $('#returnProductFilter')?.value?.toLowerCase() || '';
  const reasonFilter = $('#returnReasonFilter')?.value?.toLowerCase() || '';
  const startDateFilter = $('#returnStartDateFilter')?.value;
  const endDateFilter = $('#returnEndDateFilter')?.value;

  const filtered = state.returns.filter(r => {
    const product = state.products.find(p => p.id === r.productId);
    const matchesProduct = productFilter === '' || (product && (product.name.toLowerCase().includes(productFilter) || product.sku.toLowerCase().includes(productFilter)));
    const matchesReason = reasonFilter === '' || r.reason.toLowerCase().includes(reasonFilter);
    const returnDate = new Date(r.date);
    const matchesStartDate = !startDateFilter || returnDate >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || returnDate <= new Date(endDateFilter + 'T23:59:59');
    return matchesProduct && matchesReason && matchesStartDate && matchesEndDate;
  });

  [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(r => {
    const product = state.products.find(p => p.id === r.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(r.date).toLocaleString()}</td>
      <td>${product ? escape(product.name) : 'Producto no encontrado'}</td>
      <td>${r.qty}</td>
      <td>${r.reason}</td>
      <td>${r.responsible}</td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="removeReturn('${r.id}')" aria-label="Eliminar Devolución"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPurchaseOrders() {
  const tbody = $('#purchaseOrdersTbody');
  tbody.innerHTML = '';

  // Filtros
  const productFilter = $('#poProductFilter')?.value?.toLowerCase() || '';
  const supplierFilter = $('#poSupplierFilter')?.value || '';
  const statusFilter = $('#poStatusFilter')?.value || '';
  const startDateFilter = $('#poStartDateFilter')?.value;
  const endDateFilter = $('#poEndDateFilter')?.value;

  const filtered = state.purchaseOrders.filter(po => {
    const product = state.products.find(p => p.id === po.productId);
    const supplier = state.suppliers.find(s => s.id === po.supplierId);
    const matchesProduct = productFilter === '' || (product && (product.name.toLowerCase().includes(productFilter) || product.sku.toLowerCase().includes(productFilter)));
    const matchesSupplier = supplierFilter === '' || po.supplierId === supplierFilter;
    const matchesStatus = statusFilter === '' || po.status === statusFilter;
    const poDate = new Date(po.date);
    const matchesStartDate = !startDateFilter || poDate >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || poDate <= new Date(endDateFilter + 'T23:59:59');
    return matchesProduct && matchesSupplier && matchesStatus && matchesStartDate && matchesEndDate;
  });

  [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(po => {
    const product = state.products.find(p => p.id === po.productId);
    const supplier = state.suppliers.find(s => s.id === po.supplierId);
    let statusClass = '';
    switch (po.status) {
      case 'Creado': statusClass = 'status-created'; break;
      case 'Enviado': statusClass = 'status-sent'; break;
      case 'Recibido Parcial': statusClass = 'status-received-partial'; break;
      case 'Recibido Completo': statusClass = 'status-received-complete'; break;
      case 'Cancelado': statusClass = 'status-canceled'; break;
      default: statusClass = '';
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(po.date).toLocaleString()}</td>
      <td>${product ? escape(product.name) : 'Producto no encontrado'}</td>
      <td>${po.qtyOrdered}</td>
      <td>${po.qtyReceived}</td>
      <td>${supplier ? escape(supplier.name) : 'Proveedor no encontrado'}</td>
      <td><span class="status-badge ${statusClass}">${escape(po.status)}</span></td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="openPurchaseOrderEdit('${po.id}')" aria-label="Editar Pedido"><i class="fa-solid fa-pen"></i></button>
        ${po.status !== 'Recibido Completo' && po.status !== 'Cancelado' ? `<button class="btn btn-ghost" onclick="receivePurchaseOrderPrompt('${po.id}')" aria-label="Recibir Pedido"><i class="fa-solid fa-truck-loading"></i></button>` : ''}
        ${po.status !== 'Recibido Completo' && po.status !== 'Cancelado' ? `<button class="btn btn-ghost" onclick="cancelPurchaseOrder('${po.id}')" aria-label="Cancelar Pedido"><i class="fa-solid fa-ban"></i></button>` : ''}
        <button class="btn btn-ghost" onclick="removePurchaseOrder('${po.id}')" aria-label="Eliminar Pedido"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  populatePurchaseOrderFilters();
}

function populatePurchaseOrderFilters() {
  const supplierSelect = $('#poSupplierFilter');
  if (!supplierSelect) return;
  supplierSelect.innerHTML = '<option value="">Todos</option>';
  state.suppliers.forEach(s => {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = s.name;
    supplierSelect.appendChild(option);
  });
}

function renderReports() {
  // Total productos
  $('#reportTotalProducts').textContent = state.products.length;

  // Productos con bajo stock
  const lowStock = state.products.filter(p => {
    const threshold = p.lowStockThreshold !== undefined ? p.lowStockThreshold : state.settings.lowStock;
    return p.stock <= threshold;
  });
  $('#reportLowStock').textContent = lowStock.length;

  // Movimientos del mes
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyMovements = state.movements.filter(m => new Date(m.date) >= startOfMonth);
  $('#reportMonthlyMovements').textContent = monthlyMovements.length;

  // Valor inventario
  $('#reportValue').textContent = formatCurrency(state.products.reduce((sum, p) => sum + (p.stock * p.price), 0));

  // Gráficos
  renderStockByCategoryChart();
  renderMonthlyMovementsChart();
  renderTopMovingProducts();
}

function renderStockByCategoryChart() {
  const ctx = $('#stockByCategoryChart').getContext('2d');
  const categories = [...new Set(state.products.map(p => p.categoryId))];
  const categoryNames = categories.map(id => {
    const cat = state.categories.find(c => c.id === id);
    return cat ? cat.name : 'Categoría no encontrada';
  });
  const categoryStocks = categories.map(id => {
    return state.products
      .filter(p => p.categoryId === id)
      .reduce((sum, p) => sum + p.stock, 0);
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categoryNames,
      datasets: [{
        label: 'Stock Total',
        data: categoryStocks,
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(100, 116, 139, 0.6)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(100, 116, 139, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Productos'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Categoría'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      }
    }
  });
}

function renderMonthlyMovementsChart() {
  const ctx = $('#monthlyMovementsChart').getContext('2d');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentYear = new Date().getFullYear();
  const entriesData = months.map((_, i) => {
    return state.movements.filter(m => {
      const date = new Date(m.date);
      return date.getFullYear() === currentYear && date.getMonth() === i && m.type === 'entrada';
    }).reduce((sum, m) => sum + m.qty, 0);
  });
  const exitsData = months.map((_, i) => {
    return state.movements.filter(m => {
      const date = new Date(m.date);
      return date.getFullYear() === currentYear && date.getMonth() === i && m.type === 'salida';
    }).reduce((sum, m) => sum + m.qty, 0);
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Entradas',
        data: entriesData,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3,
        fill: true
      }, {
        label: 'Salidas',
        data: exitsData,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Productos'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Mes'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      }
    }
  });
}

function renderTopMovingProducts() {
  const tbody = $('#topProductsTbody');
  tbody.innerHTML = '';

  const productMovements = {};
  state.movements.forEach(m => {
    if (!productMovements[m.productId]) {
      productMovements[m.productId] = { entries: 0, exits: 0 };
    }
    if (m.type === 'entrada') {
      productMovements[m.productId].entries += m.qty;
    } else if (m.type === 'salida') {
      productMovements[m.productId].exits += m.qty;
    }
  });

  const sorted = Object.entries(productMovements)
    .map(([productId, { entries, exits }]) => ({
      productId,
      entries,
      exits,
      total: entries + exits
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  sorted.forEach(item => {
    const product = state.products.find(p => p.id === item.productId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product ? escape(product.name) : 'Producto no encontrado'}</td>
      <td>${item.entries}</td>
      <td>${item.exits}</td>
      <td>${item.total}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAlerts() {
  const container = $('#alertsContainer');
  container.innerHTML = '';

  const lowStock = state.products.filter(p => {
    const threshold = p.lowStockThreshold !== undefined ? p.lowStockThreshold : state.settings.lowStockThreshold;
    return p.stock <= threshold;
  });

  if (lowStock.length === 0) {
    container.innerHTML = '<div class="alert-empty"><i class="fa-solid fa-check-circle empty-icon"></i><h3>No hay alertas</h3><p>No hay productos con bajo stock en este momento.</p></div>';
    return;
  }

  lowStock.forEach(p => {
    const category = state.categories.find(c => c.id === p.categoryId);
    const alertClass = p.stock === 0 ? 'critical' : 'warning';
    const icon = p.stock === 0 ? 'fa-exclamation-triangle' : 'fa-exclamation-circle';
    const badgeText = p.stock === 0 ? 'Critico' : 'Bajo Stock';
    const badgeClass = p.stock === 0 ? 'critical' : 'warning';
    const tr = document.createElement('div');
    tr.className = `alert-item ${alertClass}`;
    tr.innerHTML = `
      <div class="alert-info">
        <i class="fa-solid ${icon} alert-icon"></i>
        <div>
          <div class="alert-product">${escape(p.name)}</div>
          <div class="small">Categoría: ${category ? escape(category.name) : 'N/A'}</div>
        </div>
      </div>
      <div>
        <span class="alert-badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
    container.appendChild(tr);
  });
  updateAlertsCount();
}

function renderUsers() {
  const tbody = $('#usersTbody');
  tbody.innerHTML = '';
  state.users.forEach(u => {
    const tr = document.createElement('tr');
    const roleClass = u.role === 'admin' ? 'role-admin' : 'role-user';
    const roleText = u.role === 'admin' ? 'Administrador' : 'Usuario';
    tr.innerHTML = `
      <td>${escape(u.name)}</td>
      <td>${u.email}</td>
      <td><span class="role-badge ${roleClass}">${roleText}</span></td>
      <td class="table-actions">
        <button class="btn btn-ghost" onclick="openUserEdit('${u.id}')" aria-label="Editar Usuario"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-ghost" onclick="removeUser('${u.id}')" aria-label="Eliminar Usuario"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSettings() {
  $('#cfgLowStockThreshold').value = state.settings.lowStockThreshold;
  $('#cfgNotifyLowStock').value = state.settings.notify ? 'true' : 'false';
  $('#cfgNotifications').value = state.settings.notify ? 'true' : 'false';

  const backupInfo = $('#backupInfo');
  const lastBackup = localStorage.getItem('inventrack_backup_date');
  if (lastBackup) {
    backupInfo.textContent = `Último respaldo: ${new Date(lastBackup).toLocaleString()}`;
  }
}

// === MODALES ===
function openModal(id) {
  $(`#${id}`).classList.add('active');
}

function closeModal(id) {
  $(`#${id}`).classList.remove('active');
}

// === PRODUCTOS ===
function openProductModalForNew() {
  $('#productModalTitle').textContent = 'Nuevo Producto';
  $('#m_pName').value = '';
  $('#m_pSku').value = '';
  $('#m_pCategory').value = '';
  $('#m_pSupplier').value = '';
  $('#m_pStock').value = '';
  $('#m_pPrice').value = '';
  $('#m_pLocation').value = '';
  $('#m_pLowStockThreshold').value = '';
  $('#m_pIndex').value = '';
  populateSelects();
  openModal('productModal');
}

function openProductModalForEdit(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  $('#productModalTitle').textContent = 'Editar Producto';
  $('#m_pName').value = product.name;
  $('#m_pSku').value = product.sku;
  $('#m_pCategory').value = product.categoryId;
  $('#m_pSupplier').value = product.supplierId;
  $('#m_pStock').value = product.stock;
  $('#m_pPrice').value = product.price;
  $('#m_pLocation').value = product.location || '';
  $('#m_pLowStockThreshold').value = product.lowStockThreshold || '';
  $('#m_pIndex').value = product.id;
  populateSelects();
  openModal('productModal');
}

function saveProductModal() {
  const id = $('#m_pIndex').value;
  const name = $('#m_pName').value.trim();
  const sku = $('#m_pSku').value.trim();
  const categoryId = $('#m_pCategory').value;
  const supplierId = $('#m_pSupplier').value;
  const stock = parseInt($('#m_pStock').value);
  const price = parseFloat($('#m_pPrice').value);
  const location = $('#m_pLocation').value.trim();
  const lowStockThreshold = $('#m_pLowStockThreshold').value ? parseInt($('#m_pLowStockThreshold').value) : undefined;

  if (!name || !sku || !categoryId || !supplierId || isNaN(stock) || isNaN(price)) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }

  if (state.products.some(p => p.sku === sku && p.id !== id)) {
    showToast('El SKU ya existe', 'error');
    return;
  }

  if (id) {
    // Editar
    const index = state.products.findIndex(p => p.id === id);
    const oldProduct = { ...state.products[index] };
    state.products[index] = { ...oldProduct, name, sku, categoryId, supplierId, stock, price, location, lowStockThreshold };
    showToast('Producto actualizado');
    logAction('Producto Actualizado', `Producto "${name}" actualizado.`);
  } else {
    // Crear
    const newProduct = {
      id: id(),
      name,
      sku,
      categoryId,
      supplierId,
      stock,
      price,
      location,
      lowStockThreshold
    };
    state.products.push(newProduct);
    showToast('Producto creado');
    logAction('Producto Creado', `Nuevo producto: ${name}`);
  }
  save();
  closeModal('productModal');
  renderProducts();
  updateAlertsCount();
}

function removeProduct(id) {
  showCustomConfirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.', () => {
    const initialLength = state.products.length;
    state.products = state.products.filter(p => p.id !== id);
    if (state.products.length < initialLength) {
      save();
      renderProducts();
      showToast('Producto eliminado');
      logAction('Producto Eliminado', `Producto eliminado.`);
    } else {
      showToast('Error al eliminar el producto', 'error');
    }
  });
  updateAlertsCount();
}

function openProductHistory(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const tbody = $('#productHistoryTbody');
  tbody.innerHTML = '';
  const history = state.movements.filter(m => m.productId === productId);
  if (history.length === 0) {
    $('#productHistoryEmpty').style.display = 'block';
    tbody.style.display = 'none';
  } else {
    $('#productHistoryEmpty').style.display = 'none';
    tbody.style.display = 'table-row-group';
    [...history].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(m.date).toLocaleString()}</td>
        <td><span class="status-badge ${m.type === 'entrada' ? 'status-entry' : 'status-exit'}">${m.type === 'entrada' ? 'Entrada' : 'Salida'}</span></td>
        <td>${m.qty}</td>
        <td>${m.responsible}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  openModal('productHistoryModal');
}

// === CATEGORÍAS ===
function openCategoryModalForNew() {
  $('#m_cName').value = '';
  $('#m_cDesc').value = '';
  $('#m_cIndex').value = '';
  openModal('categoryModal');
}

function openCategoryModalForEdit(id) {
  const category = state.categories.find(c => c.id === id);
  if (!category) return;

  $('#m_cName').value = category.name;
  $('#m_cDesc').value = category.desc || '';
  $('#m_cIndex').value = category.id;
  openModal('categoryModal');
}

function saveCategoryModal() {
  const categoryId = $('#m_cIndex').value;
  const name = $('#m_cName').value.trim();
  const desc = $('#m_cDesc').value.trim();

  if (!name) {
    showToast('El nombre es requerido', 'error');
    return;
  }

  const existingCategory = state.categories.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== categoryId);
  if (existingCategory) {
    showToast('Ya existe una categoría con este nombre.', 'error');
    return;
  }

  if (categoryId) {
    const index = state.categories.findIndex(c => c.id === categoryId);
    const oldCategory = { ...state.categories[index] };
    state.categories[index] = { ...oldCategory, name, desc };
    showToast('Categoría actualizada');
    logAction('Categoría Actualizada', `Categoría "${name}" actualizada.`);
  } else {
    const newCategory = { id: id(), name, desc };
    state.categories.push(newCategory);
    showToast('Categoría creada');
    logAction('Categoría Creada', `Nueva categoría: ${name}`);
  }
  save();
  closeModal('categoryModal');
  renderCategories();
  populateSelects();
}

function removeCategory(id) {
  showCustomConfirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.', () => {
    const initialLength = state.categories.length;
    state.categories = state.categories.filter(c => c.id !== id);
    if (state.categories.length < initialLength) {
      // Actualizar productos que usaban esta categoría
      state.products = state.products.map(p => p.categoryId === id ? { ...p, categoryId: null } : p);
      save();
      renderCategories();
      renderProducts();
      showToast('Categoría eliminada');
      logAction('Categoría Eliminada', `Categoría eliminada.`);
    } else {
      showToast('Error al eliminar la categoría', 'error');
    }
  });
}

// === PROVEEDORES ===
function openSupplierModalForNew() {
  $('#m_sName').value = '';
  $('#m_sContact').value = '';
  $('#m_sPhone').value = '';
  $('#m_sIndex').value = '';
  openModal('supplierModal');
}

function openSupplierModalForEdit(id) {
  const supplier = state.suppliers.find(s => s.id === id);
  if (!supplier) return;

  $('#m_sName').value = supplier.name;
  $('#m_sContact').value = supplier.contact || '';
  $('#m_sPhone').value = supplier.phone || '';
  $('#m_sIndex').value = supplier.id;
  openModal('supplierModal');
}

function saveSupplierModal() {
  const supplierId = $('#m_sIndex').value;
  const name = $('#m_sName').value.trim();
  const contact = $('#m_sContact').value.trim();
  const phone = $('#m_sPhone').value.trim();

  if (!name) {
    showToast('El nombre es requerido', 'error');
    return;
  }

  const existingSupplier = state.suppliers.find(s => s.name.toLowerCase() === name.toLowerCase() && s.id !== supplierId);
  if (existingSupplier) {
    showToast('Ya existe un proveedor con este nombre.', 'error');
    return;
  }

  if (supplierId) {
    const index = state.suppliers.findIndex(s => s.id === supplierId);
    const oldSupplier = { ...state.suppliers[index] };
    state.suppliers[index] = { ...oldSupplier, name, contact, phone };
    showToast('Proveedor actualizado');
    logAction('Proveedor Actualizado', `Proveedor "${name}" actualizado.`);
  } else {
    const newSupplier = { id: id(), name, contact, phone };
    state.suppliers.push(newSupplier);
    showToast('Proveedor creado');
    logAction('Proveedor Creado', `Nuevo proveedor: ${name}`);
  }
  save();
  closeModal('supplierModal');
  renderSuppliers();
  populateSelects();
}

function removeSupplier(id) {
  showCustomConfirm('¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se puede deshacer.', () => {
    const initialLength = state.suppliers.length;
    state.suppliers = state.suppliers.filter(s => s.id !== id);
    if (state.suppliers.length < initialLength) {
      // Actualizar productos que usaban este proveedor
      state.products = state.products.map(p => p.supplierId === id ? { ...p, supplierId: null } : p);
      save();
      renderSuppliers();
      renderProducts();
      showToast('Proveedor eliminado');
      logAction('Proveedor Eliminado', `Proveedor "${name}" eliminado.`);
    } else {
      showToast('Error al eliminar el proveedor', 'error');
    }
  });
}

// === MOVIMIENTOS ===
function submitMovement(modalId, type) {
  const productId = $(`#${modalId} select`).value;
  const qty = parseInt($(`#${modalId} input[type="number"]`).value || '0', 10);
  const resp = $(`#${modalId} input[type="text"]`).value.trim() || 'Sistema';

  if (!productId || qty <= 0) {
    showToast('Selecciona un producto y una cantidad válida', 'error');
    return;
  }

  const product = state.products.find(p => p.id === productId);
  if (!product) {
    showToast('Producto no encontrado', 'error');
    return;
  }

  if (type === 'salida' && product.stock < qty) {
    showToast(`Stock insuficiente. Disponible: ${product.stock}`, 'error');
    return;
  }

  const newMovement = {
    date: new Date().toISOString(),
    type,
    productId,
    qty,
    responsible: resp
  };

  state.movements.push(newMovement);

  // Actualizar stock
  if (type === 'entrada') {
    product.stock += qty;
  } else if (type === 'salida') {
    product.stock -= qty;
  }

  save();
  closeModal(modalId);
  showToast(`Movimiento de ${type} registrado`);
  logAction(`Movimiento de ${type}`, `${qty} unidades de ${product.name} registradas.`);
  renderDashboard();
  renderMovements();
  renderProducts();
  updateAlertsCount();
  
}

// === SOLICITUDES ===
function openRequestEdit(id) {
  const req = state.requests.find(r => r.id === id);
  if (!req) {
    showToast('Solicitud no encontrada', 'error');
    return;
  }

  const product = state.products.find(p => p.id === req.productId);
  $('#m_reqProductName').value = product ? product.id : '';
  $('#m_reqQty').value = req.qty;
  $('#m_reqResponsible').value = req.responsible;
  $('#m_reqJustification').value = req.justification || 'Sin justificación';
  $('#m_reqStatus').value = req.status;
  $('#m_reqId').value = req.id;
  openModal('requestModal');
}

function saveRequestModal() {
  const requestId = $('#m_reqId').value;
  const newStatus = $('#m_reqStatus').value;
  const requestIndex = state.requests.findIndex(r => r.id === requestId);

  if (requestIndex === -1) {
    showToast('Solicitud no encontrada', 'error');
    return;
  }

  const oldStatus = state.requests[requestIndex].status;
  state.requests[requestIndex].status = newStatus;

  // Si se aprueba, actualizar stock
  if (newStatus === 'Aprobada' && oldStatus !== 'Aprobada') {
    const req = state.requests[requestIndex];
    const product = state.products.find(p => p.id === req.productId);
    if (product) {
      product.stock -= req.qty;
      showToast(`Stock actualizado: ${product.name} (${product.stock} restantes)`);
    }
  }

  save();
  closeModal('requestModal');
  renderRequests();
  renderProducts();
  showToast('Estado de solicitud actualizado con éxito');
  logAction('Solicitud Actualizada', `Solicitud #${requestId} actualizada a estado: ${newStatus}`);
}

function removeRequest(id) {
  showCustomConfirm('¿Estás seguro de que quieres eliminar esta solicitud? Esta acción no se puede deshacer.', () => {
    const initialLength = state.requests.length;
    state.requests = state.requests.filter(req => req.id !== id);
    if (state.requests.length < initialLength) {
      save();
      renderRequests();
      showToast('Solicitud eliminada con éxito');
      logAction('Solicitud Eliminada', `Solicitud #${id} eliminada.`);
    } else {
      showToast('Error al eliminar la solicitud', 'error');
    }
  });
}

// === DEVOLUCIONES ===
function saveReturnModal() {
  const productId = $('#m_retProduct').value;
  const qty = parseInt($('#m_retQty').value);
  const reason = $('#m_retReason').value.trim();
  const responsible = $('#m_retResponsible').value.trim() || 'Sistema';

  if (!productId || qty <= 0 || !reason) {
    showToast('Completa todos los campos para la devolución', 'error');
    return;
  }

  const product = state.products.find(p => p.id === productId);
  if (!product) {
    showToast('Producto no encontrado', 'error');
    return;
  }

  const oldStock = product.stock;
  product.stock += qty;

  const newReturn = {
    id: id(),
    date: new Date().toISOString(),
    productId: productId,
    qty: qty,
    reason: reason,
    responsible: responsible
  };

  state.returns.push(newReturn);
  save();
  closeModal('returnModal');
  showToast(`Devolución registrada. Stock actualizado de ${oldStock} a ${product.stock}`);
  logAction('Devolución Registrada', `Devolución de ${qty} unidades de ${product.name}.`);
  renderReturns();
  renderProducts();
}

function removeReturn(id) {
  showCustomConfirm('¿Estás seguro de que quieres eliminar esta devolución? Esta acción no se puede deshacer.', () => {
    const initialLength = state.returns.length;
    const returnItem = state.returns.find(r => r.id === id);
    if (!returnItem) return;

    const product = state.products.find(p => p.id === returnItem.productId);
    if (product) {
      product.stock -= returnItem.qty; // Revertir stock
    }

    state.returns = state.returns.filter(r => r.id !== id);
    if (state.returns.length < initialLength) {
      save();
      renderReturns();
      renderProducts();
      showToast('Devolución eliminada');
      logAction('Devolución Eliminada', `Devolución eliminada.`);
    } else {
      showToast('Error al eliminar la devolución', 'error');
    }
  });
}

// === PEDIDOS DE COMPRA ===
function savePurchaseOrderModal() {
  const poId = $('#m_poId').value;
  const productId = $('#m_poProduct').value;
  const qtyOrdered = parseInt($('#m_poQtyOrdered').value);
  const supplierId = $('#m_poSupplier').value;
  const status = $('#m_poStatus').value;

  if (!productId || qtyOrdered <= 0 || !supplierId) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }

  const data = {
    productId,
    qtyOrdered,
    supplierId,
    status
  };

  if (poId) {
    // Editar
    const index = state.purchaseOrders.findIndex(p => p.id === poId);
    if (index !== -1) {
      state.purchaseOrders[index] = { ...state.purchaseOrders[index], ...data };
      showToast('Pedido de compra actualizado.');
      logAction('Pedido de Compra Actualizado', `Pedido de compra actualizado.`);
    }
  } else {
    // Crear
    const newPo = {
      id: id(),
      date: new Date().toISOString(),
      qtyReceived: 0, // Initially 0
      ...data
    };
    state.purchaseOrders.push(newPo);
    showToast('Pedido de compra creado con éxito.');
    logAction('Pedido de Compra Creado', `Nuevo pedido de compra para ${data.qtyOrdered} unidades.`);
  }
  save();
  closeModal('purchaseOrderModal');
  renderPurchaseOrders();
}

function openPurchaseOrderEdit(id) {
  const po = state.purchaseOrders.find(p => p.id === id);
  if (!po) {
    showToast('Pedido no encontrado', 'error');
    return;
  }

  $('#m_poId').value = po.id;
  $('#m_poProduct').value = po.productId;
  $('#m_poQtyOrdered').value = po.qtyOrdered;
  $('#m_poSupplier').value = po.supplierId;
  $('#m_poStatus').value = po.status;
  $('#purchaseOrderModalTitle').textContent = 'Editar Pedido de Compra';
  populateSelects();
  openModal('purchaseOrderModal');
}

function receivePurchaseOrderPrompt(id) {
  const po = state.purchaseOrders.find(p => p.id === id);
  if (!po) {
    showToast('Pedido no encontrado', 'error');
    return;
  }

  let receivedQty = prompt(`¿Cuántas unidades de "${state.products.find(p => p.id === po.productId)?.name || 'producto'}" recibes? (Máximo: ${po.qtyOrdered - po.qtyReceived})`);
  receivedQty = parseInt(receivedQty);

  if (isNaN(receivedQty) || receivedQty <= 0) {
    showToast('Cantidad inválida', 'error');
    return;
  }

  if (po.qtyReceived + receivedQty > po.qtyOrdered) {
    showToast('La cantidad recibida excede la cantidad pedida', 'error');
    return;
  }

  const product = state.products.find(p => p.id === po.productId);
  if (product) {
    product.stock += receivedQty;
  }

  po.qtyReceived += receivedQty;

  if (po.qtyReceived >= po.qtyOrdered) {
    po.status = 'Recibido Completo';
  } else {
    po.status = 'Recibido Parcial';
  }

  save();
  showToast(`Pedido actualizado. Recibidas ${receivedQty} unidades. Total recibido: ${po.qtyReceived}/${po.qtyOrdered}`);
  logAction('Pedido Actualizado', `Pedido #${id} actualizado a estado: ${po.status}`);
  renderPurchaseOrders();
  renderProducts();
}

function cancelPurchaseOrder(id) {
  showCustomConfirm('¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.', () => {
    const po = state.purchaseOrders.find(p => p.id === id);
    if (!po) return;

    po.status = 'Cancelado';
    save();
    showToast('Pedido cancelado');
    logAction('Pedido Cancelado', `Pedido #${id} cancelado.`);
    renderPurchaseOrders();
  });
}

function removePurchaseOrder(id) {
  showCustomConfirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.', () => {
    const initialLength = state.purchaseOrders.length;
    state.purchaseOrders = state.purchaseOrders.filter(po => po.id !== id);
    if (state.purchaseOrders.length < initialLength) {
      save();
      renderPurchaseOrders();
      showToast('Pedido eliminado');
      logAction('Pedido Eliminado', `Pedido #${id} eliminado.`);
    } else {
      showToast('Error al eliminar el pedido', 'error');
    }
  });
}

// === UTILIDADES ===
function populateSelects() {
  // Categorías
  const categorySelects = $$('select[id*="Category"]');
  categorySelects.forEach(select => {
    select.innerHTML = '';
    state.categories.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = c.name;
      select.appendChild(option);
    });
  });

  // Proveedores
  const supplierSelects = $$('select[id*="Supplier"]');
  supplierSelects.forEach(select => {
    select.innerHTML = '';
    state.suppliers.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.name;
      select.appendChild(option);
    });
  });

  // Productos
  const productSelects = $$('select[id*="Product"]');
  productSelects.forEach(select => {
    select.innerHTML = '';
    state.products.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.name} (${p.sku})`;
      select.appendChild(option);
    });
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
}

function escape(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showCustomConfirm(message, callback) {
  Swal.fire({
    title: 'Confirmar Acción',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
}

function showToast(msg, type = 'success') {
  if (!state.settings.notify) return;
  const wrap = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const color = type === 'success' ? 'var(--success-500)' : 'var(--danger-500)';
  el.innerHTML = `<i class="fa-solid ${icon}" style="color:${color}"></i><div>${msg}</div>`;
  wrap.appendChild(el);

  setTimeout(() => {
    el.classList.add('closing');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('inventrack_theme', isDark ? 'dark' : 'light');
  const themeToggle = $('.theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i> Modo Claro' : '<i class="fa-solid fa-moon"></i> Modo Oscuro';
  }
}

function updateTheme() {
  const savedTheme = localStorage.getItem('inventrack_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const themeToggle = $('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Modo Claro';
    }
  }
}

function saveSettings() {
  state.settings.lowStockThreshold = parseInt($('#cfgLowStockThreshold').value) || 5;
  state.settings.notify = $('#cfgNotifications').value === 'true';


  save();
  showToast('Configuración guardada');
  renderProducts(); // Actualizar visualización de stock
  renderAlerts(); // Actualizar alertas
}

function resetSettings() {
  showCustomConfirm('¿Estás seguro de que quieres resetear la configuración a los valores predeterminados?', () => {
    state.settings = {
      lowStockThreshold: 5,
      notify: true,
      language: 'es'
    };
    save();
    renderSettings();
    showToast('Configuración restablecida');
  });
}

function createBackup() {
  const dataStr = JSON.stringify(state, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `inventrack_backup_${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();

  localStorage.setItem('inventrack_backup_date', new Date().toISOString());
  const backupInfo = $('#backupInfo');
  backupInfo.textContent = `Último respaldo: ${new Date().toLocaleString()}`;
  showToast('Respaldo creado exitosamente');
}

function logAction(type, details) {
  const newLog = {
    date: new Date().toISOString(),
    userId: state.users[0].id, // Asignar al primer usuario (admin)
    actionType: type,
    details: details
  };
  state.logs.push(newLog);
  save();
}

// === FILTROS ===
function clearProductFilters() {
  if ($('#productCategoryFilter')) $('#productCategoryFilter').value = '';
  if ($('#minStockFilter')) $('#minStockFilter').value = '';
  if ($('#maxStockFilter')) $('#maxStockFilter').value = '';
  renderProducts();
}

function clearSupplierFilters() {
  if ($('#supplierFilter')) $('#supplierFilter').value = '';
  renderSuppliers();
}

function clearMovementFilters() {
  if ($('#movementTypeFilter')) $('#movementTypeFilter').value = '';
  if ($('#movementResponsibleFilter')) $('#movementResponsibleFilter').value = '';
  if ($('#movementStartDateFilter')) $('#movementStartDateFilter').value = '';
  if ($('#movementEndDateFilter')) $('#movementEndDateFilter').value = '';
  renderMovements();
}

function clearRequestFilters() {
  if ($('#requestProductFilter')) $('#requestProductFilter').value = '';
  if ($('#requestResponsibleFilter')) $('#requestResponsibleFilter').value = '';
  if ($('#requestStatusFilter')) $('#requestStatusFilter').value = '';
  if ($('#requestStartDateFilter')) $('#requestStartDateFilter').value = '';
  if ($('#requestEndDateFilter')) $('#requestEndDateFilter').value = '';
  renderRequests();
}

function clearReturnFilters() {
  if ($('#returnProductFilter')) $('#returnProductFilter').value = '';
  if ($('#returnReasonFilter')) $('#returnReasonFilter').value = '';
  if ($('#returnStartDateFilter')) $('#returnStartDateFilter').value = '';
  if ($('#returnEndDateFilter')) $('#returnEndDateFilter').value = '';
  renderReturns();
}

function clearPurchaseOrderFilters() {
  if ($('#poProductFilter')) $('#poProductFilter').value = '';
  if ($('#poSupplierFilter')) $('#poSupplierFilter').value = '';
  if ($('#poStatusFilter')) $('#poStatusFilter').value = '';
  if ($('#poStartDateFilter')) $('#poStartDateFilter').value = '';
  if ($('#poEndDateFilter')) $('#poEndDateFilter').value = '';
  renderPurchaseOrders();
}

// === FUNCIONES DEL PERFIL ===
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';
}

function toggleThemeFromProfile() {
  toggleTheme(); // Llama a la función existente de toggleTheme
  document.getElementById('profileDropdown').style.display = 'none'; // Cierra el menú
}


// Cierra el dropdown si se hace clic fuera de él
document.addEventListener('click', function(event) {
  const profileAvatar = document.getElementById('profileAvatar');
  const dropdown = document.getElementById('profileDropdown');

  if (!profileAvatar.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});


function updateAlertsCount() {
  // Contar productos con bajo stock
  const lowStock = state.products.filter(p => {
    const threshold = p.lowStockThreshold !== undefined ? p.lowStockThreshold : state.settings.lowStockThreshold;
    return p.stock <= threshold;
  });

  // Mostrar contador en el menú lateral
  const alertsCountElement = $('#alertsCount');
  if (alertsCountElement) {
    alertsCountElement.textContent = lowStock.length;
    alertsCountElement.style.display = lowStock.length > 0 ? 'inline-block' : 'none';
  }
}

function renderUserHistory() {
  // Aquí puedes implementar la lógica para mostrar el historial de usuarios
  // Basado en el log de acciones (state.logs)
  const tbody = $('#userHistoryTbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const userActions = state.logs.filter(log => log.actionType.includes('Usuario'));
  [...userActions].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(log.date).toLocaleString()}</td>
      <td>${log.actionType}</td>
      <td>${log.details}</td>
    `;
    tbody.appendChild(tr);
  });
}


// === CRUD DE USUARIOS ===

function openUserModalForNew() {
  // Limpiar los campos del formulario
  document.querySelector('#userModal form').reset();
  // Asegurar que el ID esté vacío (esto indica que es un nuevo usuario)
  $('#m_uIndex').value = '';
  // Cambiar el título del modal
  $('#userModalTitle').textContent = 'Nuevo Usuario';
  // Abrir el modal
  openModal('userModal');
}

function openUserEdit(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  $('#userModalTitle').textContent = 'Editar Usuario';
  $('#m_uName').value = user.name;
  $('#m_uEmail').value = user.email;
  $('#m_uRole').value = user.role || 'user';
  $('#m_uIndex').value = user.id;
  openModal('userModal');
}

function saveUserModal() {
  const id = $('#m_uIndex').value;
  const name = $('#m_uName').value.trim();
  const email = $('#m_uEmail').value.trim();
  const role = $('#m_uRole').value;

  if (!name || !email || !role) {
    showToast('Completa todos los campos', 'error');
    return;
  }

  if (id) {
    // Editar
    const index = state.users.findIndex(u => u.id === id);
    state.users[index] = { ...state.users[index], name, email, role };
    showToast('Usuario actualizado');
    logAction('Usuario Actualizado', `Usuario "${name}" actualizado.`);
  } else {
    // Crear
    const newUser = { id: id(), name, email, role };
    state.users.push(newUser);
    showToast('Usuario creado');
    logAction('Usuario Creado', `Nuevo usuario: "${name}" (${email}) con rol: ${role}.`);
  }
  save();
  closeModal('userModal');
  renderUsers();
}

function removeUser(id) {
  showCustomConfirm('¿Eliminar este usuario? Esta acción no se puede deshacer.', () => {
    const user = state.users.find(u => u.id === id);
    if (!user) {
      showToast('Usuario no encontrado', 'error');
      return;
    }
    state.users = state.users.filter(u => u.id !== id);
    save();
    renderUsers();
    showToast('Usuario eliminado');
    logAction('Usuario Eliminado', `Usuario "${user.name}" (${user.email}) eliminado.`);
  });
}


function renderLogs() {
  const tbody = $('#logsTbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Filtros
  const typeFilter = $('#logTypeFilter')?.value?.toLowerCase() || '';
  const userFilter = $('#logUserFilter')?.value?.toLowerCase() || '';
  const startDateFilter = $('#logStartDateFilter')?.value;
  const endDateFilter = $('#logEndDateFilter')?.value;

  const filteredLogs = state.logs.filter(l => {
    const logDate = new Date(l.date);
    const matchesType = typeFilter === '' || l.actionType.toLowerCase().includes(typeFilter);
    const user = state.users.find(u => u.id === l.userId);
    const matchesUser = userFilter === '' || (user && (user.name.toLowerCase().includes(userFilter) || user.email.toLowerCase().includes(userFilter)));
    const matchesStartDate = !startDateFilter || logDate >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || logDate <= new Date(endDateFilter + 'T23:59:59');
    return matchesType && matchesUser && matchesStartDate && matchesEndDate;
  });

  [...filteredLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((l, idx) => {
    const user = state.users.find(u => u.id === l.userId);
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${idx * 30}ms`;
    tr.innerHTML = `
      <td>${new Date(l.date).toLocaleString()}</td>
      <td>${user ? escape(user.name) : 'Usuario desconocido'}</td>
      <td><strong>${escape(l.actionType)}</strong></td>
      <td>${escape(l.details || '—')}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initNav() {
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = e.currentTarget.dataset.section;
      const action = e.currentTarget.dataset.action;

      // Remover clase 'active' de todos los enlaces
      $$('.nav-link').forEach(a => a.classList.remove('active'));

      // Agregar clase 'active' al enlace actual
      e.currentTarget.classList.add('active');

      if (action === 'logout') {
        logout();
      } else if (section) {
        renderSection(section);
      }
    });
  });
}

function logout() {
  Swal.fire({
    title: '¿Estás seguro de cerrar sesión?',
    text: "Perderás la sesión actual y tendrás que iniciar sesión nuevamente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#128517',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Opcional: limpiar datos de sesión/localStorage
      // localStorage.removeItem('currentUser');

      // Redirigir al login
      window.location.href = '/inventrack_2025/login.html';
    }
  });
}



function showHelp() {
  // Cerrar el dropdown de perfil
  document.getElementById('profileDropdown').style.display = 'none';

  // Abrir modal de ayuda
  Swal.fire({
    title: '<i class="fa-solid fa-circle-info" style="color: var(--primary-500);"></i> Ayuda del Sistema',
    html: `
      <div style="text-align: left; max-height: 500px; overflow-y: auto; padding: 10px; background: var(--bg); border-radius: 8px;">
        <h3 style="margin-top: 0; color: var(--primary-500);">Guía Rápida de Inventrack</h3>
        <p>Esta aplicación te permite gestionar tu inventario de forma eficiente. A continuación, una guía de las principales secciones:</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-gauge" style="color: var(--primary-500);"></i> Dashboard</h4>
            <p>Resumen general del inventario, métricas clave y movimientos recientes.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--success-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-boxes" style="color: var(--success-500);"></i> Productos</h4>
            <p>Gestiona tus productos: crea, edita, elimina y visualiza su stock actual.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-tags" style="color: var(--warning-500);"></i> Categorías</h4>
            <p>Organiza tus productos en diferentes categorías para mejor control.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--danger-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-truck" style="color: var(--danger-500);"></i> Proveedores</h4>
            <p>Administra la información de contacto de tus proveedores.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-exchange-alt" style="color: var(--primary-500);"></i> Movimientos</h4>
            <p>Registra entradas y salidas de productos. Consulta el historial completo.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--success-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-file-invoice" style="color: var(--success-500);"></i> Solicitudes</h4>
            <p>Controla las solicitudes de stock hechas por empleados o departamentos.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-undo" style="color: var(--warning-500);"></i> Devoluciones</h4>
            <p>Registra productos devueltos y actualiza el inventario.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--danger-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-cart-shopping" style="color: var(--danger-500);"></i> Pedidos de Compra</h4>
            <p>Gestiona los pedidos hechos a proveedores y su estado de recepción.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-chart-line" style="color: var(--primary-500);"></i> Reportes</h4>
            <p>Genera reportes clave del inventario: stock, movimientos, valor total, etc.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--success-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-bell" style="color: var(--success-500);"></i> Alertas</h4>
            <p>Consulta productos con bajo stock o en situación crítica.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-users" style="color: var(--warning-500);"></i> Usuarios</h4>
            <p>Administra los usuarios y roles del sistema.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--danger-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-history" style="color: var(--danger-500);"></i> Registro de Actividad</h4>
            <p>Visualiza un historial de todas las acciones importantes realizadas en el sistema.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-cog" style="color: var(--primary-500);"></i> Configuración</h4>
            <p>Personaliza el comportamiento del sistema: umbrales de stock, notificaciones, etc.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--success-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-moon" style="color: var(--success-500);"></i> Modo Oscuro</h4>
            <p>Cambia entre modo claro y oscuro en el menú de perfil.</p>
          </div>

          <div style="background: var(--card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning-500);">
            <h4 style="margin: 0 0 10px 0;"><i class="fa-solid fa-user-edit" style="color: var(--warning-500);"></i> Editar Perfil</h4>
            <p>Actualiza tu información personal como foto, nombre y correo.</p>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#3085d6',
    width: '90%',
    customClass: {
      popup: 'swal2-wide'
    }
  });
}


function openEditProfileModal() {
  // Cerrar el dropdown de perfil
  document.getElementById('profileDropdown').style.display = 'none';

  // Obtener datos actuales del usuario desde localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'Admin',
    email: 'admin@inventrack.com',
    profilePic: null
  };

  // Abrir modal de edición de perfil
  Swal.fire({
    title: '<i class="fa-solid fa-user-edit" style="color: var(--primary-500);"></i> Editar Perfil',
    html: `
      <div style="text-align: center; padding: 20px;">
        <div style="position: relative; display: inline-block; margin-bottom: 15px;">
          <img id="profilePicPreview" src="${currentUser.profilePic || 'https://via.placeholder.com/100'}" alt="Foto de Perfil" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--primary-500);">
          <label for="profilePicInput" style="position: absolute; bottom: 0; right: 0; background: var(--primary-500); color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <i class="fa-solid fa-camera"></i>
          </label>
        </div>
        <input type="file" id="profilePicInput" accept="image/*" style="display: none;">
        <input type="text" id="editProfileName" placeholder="Nombre Completo" value="${currentUser.name}" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text);">
        <input type="email" id="editProfileEmail" placeholder="Correo Electrónico" value="${currentUser.email}" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text);">
      </div>
    `,
    confirmButtonText: '<i class="fa-solid fa-save"></i> Guardar Cambios',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonText: '<i class="fa-solid fa-times"></i> Cancelar',
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#editProfileName').value;
      const email = Swal.getPopup().querySelector('#editProfileEmail').value;
      const file = Swal.getPopup().querySelector('#profilePicInput').files[0];

      if (!name || !email) {
        Swal.showValidationMessage('Por favor, completa todos los campos obligatorios');
        return false;
      }

      // Convertir imagen a URL si se subió una nueva
      let profilePic = currentUser.profilePic;
      if (file) {
        profilePic = URL.createObjectURL(file);
      }

      // Guardar cambios en localStorage
      const updatedUser = { name, email, profilePic };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Mostrar mensaje de éxito
      Swal.fire({
        title: '¡Perfil Actualizado!',
        text: 'Tus datos han sido guardados correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
      });

      // Actualizar el avatar en el menú lateral
      const profileAvatar = document.querySelector('.profile .profile-avatar');
      if (profilePic) {
        // Si hay imagen, mostrarla
        profileAvatar.innerHTML = `<img src="${profilePic}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
      } else {
        // Si no hay imagen, mostrar la inicial del nombre
        profileAvatar.textContent = name.charAt(0).toUpperCase();
      }

      // Actualizar el nombre y correo en el dropdown del perfil (si existe)
      const profileName = document.getElementById('profileName');
      const profileEmail = document.getElementById('profileEmail');
      if (profileName) profileName.textContent = name;
      if (profileEmail) profileEmail.textContent = email;

      // Actualizar el avatar en el dropdown del perfil
const avatarPlaceholder = document.getElementById('avatarPlaceholder');
const avatarImage = document.getElementById('avatarImage');
if (profilePic) {
  // Si hay imagen, mostrarla
  avatarImage.src = profilePic;
  avatarImage.style.display = 'block';
  avatarPlaceholder.style.display = 'none';
} else {
  // Si no hay imagen, mostrar la inicial del nombre
  avatarPlaceholder.textContent = name.charAt(0).toUpperCase();
  avatarPlaceholder.style.display = 'flex';
  avatarImage.style.display = 'none';
}
    }
  });

  // Actualizar vista previa de la imagen al seleccionar una nueva
  document.getElementById('profilePicInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('profilePicPreview').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

function updateProfileAvatar() {
  // Obtener datos del usuario desde localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'Admin',
    email: 'admin@inventrack.com',
    profilePic: null
  };

  // Actualizar el avatar en el menú lateral
  const profileAvatar = document.querySelector('.profile .profile-avatar');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');
  const avatarImage = document.getElementById('avatarImage');

  if (currentUser.profilePic) {
    // Si hay imagen, mostrarla
    avatarImage.src = currentUser.profilePic;
    avatarImage.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
  } else {
    // Si no hay imagen, mostrar la inicial del nombre
    avatarPlaceholder.textContent = currentUser.name.charAt(0).toUpperCase();
    avatarPlaceholder.style.display = 'flex';
    avatarImage.style.display = 'none';
  }

  // Actualizar el nombre y correo en el dropdown del perfil
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  if (profileName) profileName.textContent = currentUser.name;
  if (profileEmail) profileEmail.textContent = currentUser.email;
}

 



// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initNav(); // Asegúrate de que esta línea esté presente
});