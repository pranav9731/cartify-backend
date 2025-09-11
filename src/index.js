import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Database setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

let db;

// Initialize database
async function initDatabase() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const dbFile = path.join(dataDir, 'db.json');
    const defaultData = { users: [], items: [], carts: [] };
    const adapter = new JSONFile(dbFile);
    
    db = new Low(adapter, defaultData);
    await db.read();
    
    if (!db.data) {
      db.data = defaultData;
    }
    
    await db.write();
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Seed data - only if database is empty
async function seedIfEmpty() {
  try {
    await db.read();
    
    // Check if database already has items
    if (db.data.items && db.data.items.length > 0) {
      console.log('Database already contains data, skipping seed');
      return;
    }
    
    console.log('Database is empty, seeding with initial data...');
    
    // Sample seed data
    const sampleItems = [
      {
        id: "item1",
        title: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones",
        price: 149.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "item2", 
        title: "Smart Watch",
        description: "Fitness tracking and notifications",
        price: 199.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "item3",
        title: "Coffee Machine",
        description: "Automatic espresso maker",
        price: 299.99,
        category: "Home",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "item4",
        title: "Running Shoes",
        description: "Lightweight athletic shoes",
        price: 89.99,
        category: "Fashion",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        createdAt: new Date().toISOString()
      },
      {
        id: "item5",
        title: "Yoga Mat",
        description: "Non-slip exercise mat",
        price: 29.99,
        category: "Sports",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        createdAt: new Date().toISOString()
      }
    ];
    
    // Add seed data
    db.data.items = sampleItems;
    await db.write();
    
    console.log(`Seeded database with ${sampleItems.length} items`);
  } catch (error) {
    console.error('Seeding failed:', error);
    // Don't throw error - continue with empty database
  }
}

// Start server
async function startServer() {
  try {
    const app = express();
    
    // Initialize database first
    await initDatabase();
    
    // Seed if empty
    await seedIfEmpty();

    //Declaration
    global.db = db;
    
    // CORS configuration
    app.use(cors({
      origin: "https://cartify-m.netlify.app",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }));
    
    app.use(express.json());
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        ok: true, 
        timestamp: new Date().toISOString(),
        itemCount: db.data.items?.length || 0
      });
    });
    
    // Basic items endpoint for testing
    app.get('/api/items', async (req, res) => {
      try {
        await db.read();
        res.json(db.data.items || []);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
      }
    });
    
    // Import and set up routes after database is ready
    try {
      const authRoutes = await import('./routes/auth.js');
      const itemRoutes = await import('./routes/items.js');
      const cartRoutes = await import('./routes/cart.js');
      
      app.use('/api/auth', authRoutes.default);
      app.use('/api/items', itemRoutes.default);
      app.use('/api/cart', cartRoutes.default);
      
      console.log('Routes loaded successfully');
    } catch (routeError) {
      console.error('Failed to load routes:', routeError);
      // Continue without routes for now
    }
    
    // Export db for use in routes
    global.db = db;
    
    // Start listening
    const port = process.env.PORT || 4000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export database for routes
export { db };

// Start the server
startServer();
