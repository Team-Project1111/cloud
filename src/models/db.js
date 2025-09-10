import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = process.env.DATABASE_URL;
const projectRoot = path.join(__dirname, '..');
const resolvedPath = envPath
	? (path.isAbsolute(envPath) ? envPath : path.join(projectRoot, envPath))
	: path.join(projectRoot, 'db', 'app.db');

const dbDir = path.dirname(resolvedPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(resolvedPath);

db.pragma('foreign_keys = ON');

