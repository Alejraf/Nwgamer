const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos en memoria de ejemplo (reemplazable por PostgreSQL, MongoDB o SQLite)
let items = [
  { id: 1, title: 'Configurar proyecto móvil', category: 'Desarrollo', completed: true, createdAt: new Date().toISOString() },
  { id: 2, title: 'Probar modo offline (PWA)', category: 'Testing', completed: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Desplegar en Render / GitHub', category: 'Deploy', completed: false, createdAt: new Date().toISOString() }
];

// Endpoint de estado / salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Obtener todos los elementos
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Crear nuevo elemento
app.post('/api/items', (req, res) => {
  const { title, category } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const newItem = {
    id: Date.now(),
    title: title.trim(),
    category: (category && category.trim()) || 'General',
    completed: false,
    createdAt: new Date().toISOString()
  };
  items.unshift(newItem);
  res.status(201).json(newItem);
});

// Alternar estado completado
app.patch('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Elemento no encontrado' });
  }
  item.completed = !item.completed;
  res.json(item);
});

// Eliminar elemento
app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = items.length;
  items = items.filter(i => i.id !== id);
  if (items.length === initialLength) {
    return res.status(404).json({ error: 'Elemento no encontrado' });
  }
  res.json({ deleted: true, id });
});

// Fallback SPA hacia index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
