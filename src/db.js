import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbFile = path.join(dataDir, 'db.json');

const defaultData = { users: [], items: [], carts: [] };
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, defaultData);
await db.read();
if (!db.data) db.data = defaultData;
await db.write();

export { db };