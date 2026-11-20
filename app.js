const itemsList = document.getElementById('itemsList');
const itemForm = document.getElementById('itemForm');
const itemTitle = document.getElementById('itemTitle');
const itemCategory = document.getElementById('itemCategory');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const doneCount = document.getElementById('doneCount');
const connectionStatus = document.getElementById('connectionStatus');
const toastEl = document.getElementById('toast');

let deferredPrompt = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2400);
}

// Navegación entre pestañas móviles
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
    document.getElementById('pageTitle').textContent = btn.dataset.title;
  });
});

// Cargar elementos desde el backend
async function loadItems() {
  try {
    const res = await fetch('/api/items');
    if (!res.ok) throw new Error('Error de red');
    const data = await res.json();
    connectionStatus.textContent = 'En línea • API conectada';
    connectionStatus.style.color = '#10b981';
    renderItems(data);
  } catch (err) {
    connectionStatus.textContent = 'Modo sin conexión';
    connectionStatus.style.color = '#f59e0b';
    showToast('No se pudo conectar con el servidor');
  }
}

function renderItems(items) {
  totalCount.textContent = items.length;
  const done = items.filter(i => i.completed).length;
  doneCount.textContent = done;
  pendingCount.textContent = items.length - done;

  itemsList.innerHTML = '';
  if (items.length === 0) {
    itemsList.innerHTML = '<li class="card"><p>No hay registros todavía. Agrega el primero arriba.</p></li>';
    return;
  }

  items.forEach(item => {
    const li = document.createElement('li');
    li.className = `item-card ${item.completed ? 'completed' : ''}`;

    const mainDiv = document.createElement('div');
    mainDiv.className = 'item-main';
    mainDiv.innerHTML = `
      <span class="checkbox">${item.completed ? '✓' : ''}</span>
      <div>
        <span class="item-title"></span>
        <span class="item-badge"></span>
      </div>
    `;
    mainDiv.querySelector('.item-title').textContent = item.title;
    mainDiv.querySelector('.item-badge').textContent = item.category;
    mainDiv.addEventListener('click', () => toggleItem(item.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', 'Eliminar');
    delBtn.addEventListener('click', () => deleteItem(item.id));

    li.appendChild(mainDiv);
    li.appendChild(delBtn);
    itemsList.appendChild(li);
  });
}

// Crear nuevo registro
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = itemTitle.value.trim();
  const category = itemCategory.value;
  if (!title) return;

  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category })
    });
    if (!res.ok) throw new Error('Error al guardar');
    itemTitle.value = '';
    showToast('Registro agregado');
    loadItems();
  } catch (err) {
    showToast('Error al guardar en el servidor');
  }
});

// Marcar / desmarcar completado
async function toggleItem(id) {
  try {
    await fetch(`/api/items/${id}`, { method: 'PATCH' });
    loadItems();
  } catch (err) {
    showToast('Error al actualizar');
  }
}

// Eliminar registro
async function deleteItem(id) {
  try {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    showToast('Registro eliminado');
    loadItems();
  } catch (err) {
    showToast('Error al eliminar');
  }
}

document.getElementById('refreshBtn').addEventListener('click', () => {
  loadItems();
  showToast('Lista actualizada');
});

document.getElementById('testApiBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    showToast(`API OK: ${new Date(data.timestamp).toLocaleTimeString()}`);
  } catch {
    showToast('Error al contactar /api/health');
  }
});

// Registro de Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Botón de instalación PWA
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add('hidden');
});

loadItems();
