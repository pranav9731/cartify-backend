import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function getOrCreateCart(userId) {
  let cart = db.data.carts.find(c => c.userId === userId);
  if (!cart) {
    cart = { userId, items: [], updatedAt: new Date().toISOString() };
    db.data.carts.push(cart);
    db.write();
  }
  return cart;
}

router.get('/', requireAuth, (req, res) => {
  const cart = getOrCreateCart(req.user.id);
  const detailedItems = cart.items
    .map(ci => {
      const product = db.data.items.find(i => i.id === ci.itemId);
      return product ? { ...ci, product } : null;
    })
    .filter(Boolean);
  const total = detailedItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  res.json({ items: detailedItems, total });
});

router.post('/add', requireAuth, (req, res) => {
  const { itemId, quantity = 1 } = req.body || {};
  if (!itemId) return res.status(400).json({ message: 'Missing itemId' });
  const item = db.data.items.find(i => i.id === itemId);
  if (!item) return res.status(400).json({ message: 'Invalid itemId' });

  const cart = getOrCreateCart(req.user.id);
  const entry = cart.items.find(i => i.itemId === itemId);
  if (entry) entry.quantity += Number(quantity) || 1;
  else cart.items.push({ itemId, quantity: Number(quantity) || 1 });

  cart.updatedAt = new Date().toISOString();
  db.write();
  res.json({ ok: true });
});

router.post('/update', requireAuth, (req, res) => {
  const { itemId, quantity } = req.body || {};
  if (!itemId || typeof quantity !== 'number') return res.status(400).json({ message: 'Missing fields' });
  const cart = getOrCreateCart(req.user.id);
  const idx = cart.items.findIndex(i => i.itemId === itemId);
  if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });
  if (quantity <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].quantity = quantity;

  cart.updatedAt = new Date().toISOString();
  db.write();
  res.json({ ok: true });
});

router.post('/remove', requireAuth, (req, res) => {
  const { itemId } = req.body || {};
  if (!itemId) return res.status(400).json({ message: 'Missing itemId' });
  const cart = getOrCreateCart(req.user.id);
  cart.items = cart.items.filter(i => i.itemId !== itemId);
  cart.updatedAt = new Date().toISOString();
  db.write();
  res.json({ ok: true });
});

export default router;