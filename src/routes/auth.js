import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
  const normalizedEmail = String(email).toLowerCase();
  if (db.data.users.some(u => u.email === normalizedEmail)) {
    return res.status(409).json({ message: 'Email already in use' });
  }
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const user = { id: nanoid(), email: normalizedEmail, name, passwordHash, createdAt: new Date().toISOString() };
  db.data.users.push(user);
  db.write();
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const normalizedEmail = String(email).toLowerCase();
  const user = db.data.users.find(u => u.email === normalizedEmail);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;