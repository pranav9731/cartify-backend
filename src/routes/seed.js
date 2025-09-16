import { db } from '../db.js';
import { nanoid } from 'nanoid';

const records = [
  { title: 'Noise-Cancelling Headphones', description: 'Over-ear Bluetooth ANC with 30h battery life', price: 149.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=1200' },
  { title: 'Smart Watch Series X', description: 'AMOLED, GPS, heart-rate, 5ATM', price: 199.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200' },
  { title: 'Espresso Machine Pro', description: '15-bar pump, steam wand, fast heat-up', price: 249.99, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200' },
  { title: 'Lightweight Running Shoes', description: 'Breathable mesh upper, responsive cushioning', price: 89.95, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200' },
  { title: 'Eco Yoga Mat', description: 'Non-slip, eco-friendly TPE, 6mm thick', price: 29.99, category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200' },
  { title: 'Mechanical Gaming Keyboard', description: 'Hot-swappable switches, RGB, PBT keycaps', price: 109.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200' },
  { title: '27" 4K IPS Monitor', description: 'High color accuracy, 60Hz, thin bezels', price: 329.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200' },
  { title: 'Ergonomic Office Chair', description: 'Adjustable lumbar, breathable mesh, headrest', price: 179.99, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?q=80&w=1200' },
  { title: 'Urban Daypack 25L', description: 'Water-resistant fabric, laptop sleeve', price: 59.99, category: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1595724281096-bd3e2b66c86a?q=80&w=1200' },
  { title: 'Stainless Steel Cookware (10pc)', description: 'Tri-ply base, oven-safe, glass lids', price: 139.99, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1588279102558-dabc7b32d9b1?q=80&w=1200' },
  { title: 'Portable Bluetooth Speaker', description: 'IPX7 waterproof, deep bass, 12h playtime', price: 79.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1200' },
  { title: 'Fitness Band', description: 'Sleep tracking, SpO2, multi-sport modes', price: 69.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1690016424217-03f4d9427a6a?q=80&w=1200' },
  { title: 'Smartphone 128GB', description: 'OLED, dual camera, 5G', price: 799.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200' },
  { title: 'Ultrabook Laptop 14"', description: 'Intel i7, 16GB RAM, 512GB SSD', price: 1199.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200' },
  { title: 'DSLR Camera Kit', description: '24MP, 18-55mm lens, Wi‑Fi', price: 899.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1519183071298-a2962be94f81?q=80&w=1200' }
];

db.data.items = records.map(r => ({ id: nanoid(), ...r, createdAt: new Date().toISOString() }));
await db.write();
console.log('Seeded items:', db.data.items.length);
