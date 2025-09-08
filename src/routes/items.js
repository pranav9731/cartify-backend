import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { search = '', category = '', minPrice, maxPrice, page = '1', limit = '12' } = req.query;
  let items = [...db.data.items];

  const s = String(search).trim().toLowerCase();
  if (s) items = items.filter(i => i.title.toLowerCase().includes(s) || i.description.toLowerCase().includes(s));

  const cat = String(category).trim().toLowerCase();
  if (cat) items = items.filter(i => i.category.toLowerCase() === cat);

  const min = Number(minPrice);
  if (!Number.isNaN(min)) items = items.filter(i => i.price >= min);

  const max = Number(maxPrice);
  if (!Number.isNaN(max)) items = items.filter(i => i.price <= max);

  const p = Math.max(1, parseInt(page));
  const l = Math.max(1, parseInt(limit));
  const total = items.length;
  const start = (p - 1) * l;

  res.json({ items: items.slice(start, start + l), total, page: p, pages: Math.ceil(total / l) });
});

router.get('/:id', (req, res) => {
  const item = db.data.items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', requireAuth, (req, res) => {
  const { title, description = '', price, category = 'General', imageUrl = '' } = req.body || {};
  if (!title || price == null) return res.status(400).json({ message: 'Missing fields' });
  const item = { id: nanoid(), title, description, price: Number(price), category, imageUrl, createdAt: new Date().toISOString() };
  db.data.items.push(item);
  db.write();
  res.status(201).json(item);
});

router.put('/:id', requireAuth, (req, res) => {
  const idx = db.data.items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const current = db.data.items[idx];
  const update = { ...current, ...req.body, price: req.body.price != null ? Number(req.body.price) : current.price };
  db.data.items[idx] = update;
  db.write();
  res.json(update);
});

router.delete('/:id', requireAuth, (req, res) => {
  const idx = db.data.items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const [removed] = db.data.items.splice(idx, 1);
  db.write();
  res.json(removed);
});

export default router;